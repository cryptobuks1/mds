from flask_restplus import Resource
from flask import request
from datetime import datetime
from sqlalchemy import desc, cast, NUMERIC, extract, asc
from sqlalchemy_filters import apply_sort, apply_pagination, apply_filters
from werkzeug.exceptions import BadRequest

from app.extensions import api
from app.api.utils.access_decorators import requires_any_of, VIEW_ALL
from app.api.utils.resources_mixins import UserMixin

from app.api.mines.mine.models.mine import Mine
from app.api.incidents.models.mine_incident import MineIncident
from app.api.incidents.models.mine_incident_do_subparagraph import MineIncidentDoSubparagraph
from app.api.incidents.response_models import PAGINATED_INCIDENT_LIST

PAGE_DEFAULT = 1
PER_PAGE_DEFAULT = 25


class IncidentsResource(Resource, UserMixin):
    @api.doc(
        description='Get a list of incidents. Order: received_date DESC',
        params={
            'page': f'The page number of paginated records to return. Default: {PAGE_DEFAULT}',
            'per_page': f'The number of records to return per page. Default: {PER_PAGE_DEFAULT}',
            'mine_guid': 'The ID of a mine',
            'search': 'A string to be search in the incident number, mine name, or mine number',
            'incident_status': 'List of the incident status codes',
            'determination':
            'List of the inspectors determination, a three character code',
            'codes':
            'List of code sub_paragraphs to include in results. Default: All status codes.',
            'incident_year': 'Return only incidents for this year',
            'major': 'boolean indicating if incident is from a major or regional mine',
            'region':
            'List of regions the mines associated with the incident are located in',
            'sort_field': 'The field the returned results will be ordered by',
            'sort_dir': 'The direction by which the sort field is ordered',
        })
    @requires_any_of([VIEW_ALL])
    @api.marshal_with(PAGINATED_INCIDENT_LIST, code=200)
    def get(self):
        args = {
            "page_number": request.args.get('page', PAGE_DEFAULT, type=int),
            "page_size": request.args.get('per_page', PER_PAGE_DEFAULT, type=int),
            "status": request.args.getlist('incident_status', type=str),
            "determination": request.args.getlist('determination', type=str),
            "codes": request.args.getlist('codes', type=str),
            'major': request.args.get('major', type=str),
            'region': request.args.getlist('region', type=str),
            'year': request.args.get('year', type=str),
            'search_terms': request.args.get('search', type=str),
            'sort_field': request.args.get('sort_field', type=str),
            'sort_dir': request.args.get('sort_dir', type=str),
            'mine_guid': request.args.get('mine_guid', type=str),
        }

        records, pagination_details = self._apply_filters_and_pagination(args)
        if not records:
            raise BadRequest('Unable to fetch incidents.')
        return {
            'records': records.all(),
            'current_page': pagination_details.page_number,
            'total_pages': pagination_details.num_pages,
            'items_per_page': pagination_details.page_size,
            'total': pagination_details.total_results,
        }

    @classmethod
    def _build_filter(cls, model, field, op, argfield):
        return {'model': model, 'field': field, 'op': op, 'value': argfield}

    def _apply_filters_and_pagination(self, args):
        sort_models = {
            "mine_incident_report_no": 'MineIncident',
            "incident_timestamp": 'MineIncident',
            "determination": 'MineIncident',
            "incident_status": 'MineIncident',
            "mine_name": 'Mine',
        }

        sort_field = {
            "mine_incident_report_no": 'mine_incident_report_no',
            "incident_timestamp": 'incident_timestamp',
            "determination": 'determination_type_code',
            "incident_status": 'status_code',
            "mine_name": 'mine_name',
        }

        query = MineIncident.query.join(Mine)
        conditions = []
        if args["mine_guid"] is not None:
            conditions.append(
                self._build_filter('MineIncident', 'mine_guid', '==', args["mine_guid"]))
        if args["status"]:
            conditions.append(
                self._build_filter('MineIncident', 'status_code', 'in', args["status"]))
        if args["determination"]:
            conditions.append(
                self._build_filter('MineIncident', 'determination_type_code', 'in',
                                   args["determination"]))
        if args["codes"]:
            query = MineIncident.query.join(Mine).outerjoin(MineIncidentDoSubparagraph)
            conditions.append(
                self._build_filter('MineIncidentDoSubparagraph', 'compliance_article_id', 'in',
                                   args["codes"]))
        if args["year"] is not None:
            min_datetime = datetime(int(args["year"]), 1, 1)
            max_datetime = datetime(int(args["year"]) + 1, 1, 1)
            conditions.append(
                self._build_filter('MineIncident', 'incident_timestamp', '>=', min_datetime))
            conditions.append(
                self._build_filter('MineIncident', 'incident_timestamp', '<', max_datetime))
        if args["major"]:
            conditions.append(self._build_filter('Mine', 'major_mine_ind', '==', args["major"]))

        if args["search_terms"] is not None:
            search_conditions = [
                self._build_filter('Mine', 'mine_name', 'ilike',
                                   '%{}%'.format(args["search_terms"])),
                self._build_filter('Mine', 'mine_no', 'ilike', '%{}%'.format(args["search_terms"])),
            ]
            conditions.append({'or': search_conditions})

        if args["region"]:
            conditions.append(self._build_filter('Mine', 'mine_region', 'in', args["region"]))   

        filtered_query = apply_filters(query, conditions)

        # Apply sorting
        if args['sort_field'] and args['sort_dir']:
            if args['sort_field'] == 'mine_incident_report_no':
                sort_criteria = [{
                    'model': 'MineIncident',
                    'field': 'mine_incident_id_year',
                    'direction': args['sort_dir']
                }, {
                    'model': 'MineIncident',
                    'field': 'mine_incident_id',
                    'direction': args['sort_dir']
                }]
            else:
                # sorting by code section is not applicable since a single incident may have many sections associated.
                sort_criteria = [{
                    'model': sort_models[args['sort_field']],
                    'field': sort_field[args['sort_field']],
                    'direction': args['sort_dir']
                }]
        else:
            # default sorting is by descending date.
            sort_criteria = [{
                'model': 'MineIncident',
                'field': 'incident_timestamp',
                'direction': 'desc'
            }]
        filtered_query = apply_sort(filtered_query, sort_criteria)

        return apply_pagination(filtered_query, args["page_number"], args["page_size"])
