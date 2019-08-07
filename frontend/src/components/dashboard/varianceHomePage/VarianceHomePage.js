import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { debounce, isEmpty } from "lodash";
import queryString from "query-string";
import moment from "moment";
import PropTypes from "prop-types";
import {
  fetchRegionOptions,
  fetchMineTenureTypes,
  fetchMineCommodityOptions,
  fetchMineComplianceCodes,
  fetchVarianceStatusOptions,
  fetchVarianceDocumentCategoryOptions,
} from "@/actionCreators/staticContentActionCreator";
import { modalConfig } from "@/components/modalContent/config";
import { openModal, closeModal } from "@/actions/modalActions";
import {
  getMineRegionHash,
  getMineTenureTypesHash,
  getCommodityOptionHash,
  getHSRCMComplianceCodesHash,
  getFilterVarianceStatusOptions,
  getDropdownHSRCMComplianceCodes,
  getMineRegionDropdownOptions,
} from "@/selectors/staticContentSelectors";
import CustomPropTypes from "@/customPropTypes";
import {
  fetchVariances,
  updateVariance,
  addDocumentToVariance,
} from "@/actionCreators/varianceActionCreator";
import { getVariances, getVariancePageData } from "@/selectors/varianceSelectors";
import { VarianceTable } from "@/components/dashboard/customHomePage/VarianceTable";
import LoadingWrapper from "@/components/common/wrappers/LoadingWrapper";
import * as Strings from "@/constants/strings";
import * as router from "@/constants/routes";
import { fetchInspectors } from "@/actionCreators/partiesActionCreator";
import VarianceSearch from "./VarianceSearch";
import AuthorizationWrapper from "@/components/common/wrappers/AuthorizationWrapper";
import * as Permission from "@/constants/permissions";

/**
 * @class Variance page is a landing page for variance searching
 *
 */

const propTypes = {
  fetchMineTenureTypes: PropTypes.func.isRequired,
  fetchVarianceDocumentCategoryOptions: PropTypes.func.isRequired,
  addDocumentToVariance: PropTypes.func.isRequired,
  updateVariance: PropTypes.func.isRequired,
  fetchMineComplianceCodes: PropTypes.func.isRequired,
  fetchRegionOptions: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  fetchInspectors: PropTypes.func.isRequired,
  fetchMineCommodityOptions: PropTypes.func.isRequired,
  fetchVarianceStatusOptions: PropTypes.func.isRequired,
  fetchVariances: PropTypes.func.isRequired,
  location: PropTypes.shape({ search: PropTypes.string }).isRequired,
  variances: PropTypes.arrayOf(CustomPropTypes.variance).isRequired,
  variancePageData: CustomPropTypes.variancePageData.isRequired,
  complianceCodesHash: PropTypes.objectOf(PropTypes.string).isRequired,
  getDropdownHSRCMComplianceCodes: CustomPropTypes.options.isRequired,
  mineRegionOptions: CustomPropTypes.options.isRequired,
  filterVarianceStatusOptions: CustomPropTypes.filterOptions.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};

const joinOrRemove = (param, key) => (isEmpty(param) ? {} : { [key]: param.join(",") });
const formatParams = ({ region = [], compliance_code = [], ...remainingParams }) => ({
  ...joinOrRemove(region, "region"),
  ...joinOrRemove(compliance_code, "compliance_code"),
  ...remainingParams,
});

export class VarianceHomePage extends Component {
  constructor(props) {
    super(props);
    this.handleVarianceSearchDebounced = debounce(this.handleVarianceSearch, 1000);
    this.state = {
      variancesLoaded: false,
      params: {
        page: Strings.DEFAULT_PAGE,
        per_page: Strings.DEFAULT_PER_PAGE,
        major: "",
        region: [],
        compliance_code: [],
        issue_date_after: "",
        issue_date_before: "",
        expiry_date_before: "",
        expiry_date_after: "",
        search: "",
      },
    };
  }

  state = {
    variancesLoaded: false,
    params: {
      variance_application_status_code: [],
      page: Strings.DEFAULT_PAGE,
      per_page: Strings.DEFAULT_PER_PAGE,
      major: "",
      region: [],
      compliance_code: [],
      issue_date_after: "",
      issue_date_before: "",
      expiry_date_before: "",
      expiry_date_after: "",
      search: "",
    },
  };

  componentDidMount() {
    const params = this.props.location.search;
    const parsedParams = queryString.parse(params);
    const {
      page = this.state.params.page,
      per_page = this.state.params.per_page,
      type = this.state.params.type,
    } = parsedParams;
    if (params) {
      this.renderDataFromURL(params);
    } else {
      this.props.history.push(
        router.VARIANCE_DASHBOARD.dynamicRoute({
          page,
          per_page,
          type,
        })
      );
    }

    this.props.fetchVariances(this.state.params).then(() => {
      this.setState({ variancesLoaded: true });
    });
    this.props.fetchInspectors();
    this.props.fetchMineTenureTypes();
    this.props.fetchMineComplianceCodes();
    this.props.fetchRegionOptions();
    this.props.fetchMineCommodityOptions();
    this.props.fetchVarianceStatusOptions();
    this.props.fetchVarianceDocumentCategoryOptions();
  }

  componentWillUnmount() {
    this.handleVarianceSearchDebounced.cancel();
    this.setState({
      params: {},
    });
  }

  renderDataFromURL = (params) => {
    const { region, compliance_code, major, search, ...remainingParams } = queryString.parse(
      params
    );
    const format = (param) => (param ? param.split(",").filter((x) => x) : []);
    this.setState({
      params: {
        region: format(region),
        compliance_code: format(compliance_code),
        major,
        search,
        ...remainingParams,
      },
    });
  };

  handleVarianceSearch = (searchParams, clear = false) => {
    const formattedSearchParams = formatParams(searchParams);
    const persistedParams = clear ? {} : formatParams(this.state.params);

    this.props.history.push(
      router.VARIANCE_DASHBOARD.dynamicRoute({
        // Start from existing state
        ...persistedParams,
        // Overwrite prev params with any newly provided search params
        ...formattedSearchParams,
        // Reset page number
        page: String.DEFAULT_PAGE,
        // Retain per_page if present
        per_page: this.state.params.per_page ? this.state.params.per_page : String.DEFAULT_PER_PAGE,
      })
    );
  };

  handleVariancePageChange = (page, per_page) => {
    this.setState({ variancesLoaded: false });
    const params = { ...this.state.params, page, per_page };
    return this.props.fetchVariances(params).then(() => {
      this.setState({
        variancesLoaded: true,
        params,
      });
    });
  };

  handleUpdateVariance = (files, variance, isApproved) => (values) => {
    // if the application isApproved, set issue_date to today and set expiry_date 5 years from today,
    // unless the user sets a custom expiry.
    const { variance_document_category_code } = values;
    const issue_date = isApproved ? moment().format("YYYY-MM-DD") : null;
    let expiry_date;
    if (isApproved) {
      expiry_date = values.expiry_date
        ? values.expiry_date
        : moment(issue_date, "YYYY-MM-DD").add(5, "years");
    }
    const newValues = { ...values, issue_date, expiry_date };
    const mineGuid = variance.mine_guid;
    const varianceGuid = variance.variance_guid;
    const codeLabel = this.props.complianceCodesHash[variance.compliance_article_id];
    this.props.updateVariance({ mineGuid, varianceGuid, codeLabel }, newValues).then(async () => {
      await Promise.all(
        Object.entries(files).map(([document_manager_guid, document_name]) =>
          this.props.addDocumentToVariance(
            { mineGuid, varianceGuid },
            {
              document_manager_guid,
              document_name,
              variance_document_category_code,
            }
          )
        )
      );
      this.props.closeModal();
      this.props.fetchVariances(this.state.params).then(() => {
        this.setState({ variancesLoaded: true });
      });
    });
  };

  openEditVarianceModal = (variance) => {
    this.props.openModal({
      props: {
        onSubmit: this.handleUpdateVariance,
        title: this.props.complianceCodesHash[variance.compliance_article_id],
        mineGuid: variance.mine_guid,
        mineName: variance.mine_name,
        varianceGuid: variance.variance_guid,
      },
      content: modalConfig.EDIT_VARIANCE,
    });
  };

  openViewVarianceModal = (variance) => {
    this.props.openModal({
      props: {
        variance,
        title: this.props.complianceCodesHash[variance.compliance_article_id],
        mineName: variance.mine_name,
      },
      content: modalConfig.VIEW_VARIANCE,
      isViewOnly: true,
    });
  };

  handleFilterChange = (pagination, filters) => {
    const { status } = filters;
    this.setState({ variancesLoaded: false });
    const params = {
      ...this.state.params,
      variance_application_status_code: status,
      page: 1,
    };
    return this.props.fetchVariances(params).then(() => {
      this.setState({
        variancesLoaded: true,
        params,
      });
    });
  };

  render() {
    return (
      <div className="landing-page">
        <div className="landing-page__header">
          <h1>Browse Variances</h1>
        </div>
        <div className="landing-page__content">
          <AuthorizationWrapper permission={Permission.IN_TESTING}>
            <VarianceSearch
              handleNameFieldReset={this.handleNameFieldReset}
              initialValues={this.state.params}
              handleVarianceSearch={this.handleVarianceSearchDebounced}
              mineRegionOptions={this.props.mineRegionOptions}
              complianceCodes={this.props.getDropdownHSRCMComplianceCodes}
            />
          </AuthorizationWrapper>
          <LoadingWrapper condition={this.state.variancesLoaded}>
            <VarianceTable
              filterVarianceStatusOptions={this.props.filterVarianceStatusOptions}
              isApplication={this.state.isApplication}
              handleFilterChange={this.handleFilterChange}
              variances={this.props.variances}
              pageData={this.props.variancePageData}
              handlePageChange={this.handleVariancePageChange}
              handleVarianceSearch={this.handleVarianceSearch}
              params={this.state.params}
              openEditVarianceModal={this.openEditVarianceModal}
              openViewVarianceModal={this.openViewVarianceModal}
            />
          </LoadingWrapper>
        </div>
      </div>
    );
  }
}

VarianceHomePage.propTypes = propTypes;

const mapStateToProps = (state) => ({
  mineRegionHash: getMineRegionHash(state),
  mineTenureHash: getMineTenureTypesHash(state),
  mineCommodityOptionsHash: getCommodityOptionHash(state),
  variancePageData: getVariancePageData(state),
  variances: getVariances(state),
  complianceCodesHash: getHSRCMComplianceCodesHash(state),
  getDropdownHSRCMComplianceCodes: getDropdownHSRCMComplianceCodes(state),
  mineRegionOptions: getMineRegionDropdownOptions(state),
  filterVarianceStatusOptions: getFilterVarianceStatusOptions(state),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchVariances,
      updateVariance,
      openModal,
      closeModal,
      fetchRegionOptions,
      addDocumentToVariance,
      fetchMineTenureTypes,
      fetchMineComplianceCodes,
      fetchMineCommodityOptions,
      fetchVarianceStatusOptions,
      fetchVarianceDocumentCategoryOptions,
      fetchInspectors,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VarianceHomePage);