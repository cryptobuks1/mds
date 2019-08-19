import { PropTypes, shape } from "prop-types";

// This file is anticipated to have multiple exports
// eslint-disable-next-line import/prefer-default-export
export const nowApplication = shape({
  application_guid: PropTypes.string.isRequired,
  mine_guid: PropTypes.string,
  mine_name: PropTypes.string,
  minenumber: PropTypes.string,
  trackingnumber: PropTypes.number,
  applicationtype: PropTypes.string,
  status: PropTypes.string,
  submitteddate: PropTypes.string,
  receiveddate: PropTypes.string,
  applicantclientid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  submitterclientid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  noticeofworktype: PropTypes.string,
  typeofpermit: PropTypes.string,
  typeofapplication: PropTypes.string,
  latitude: PropTypes.string,
  longitude: PropTypes.string,
  nameofproperty: PropTypes.string,
  tenurenumbers: PropTypes.string,
  crowngrantlotnumbers: PropTypes.string,
  sitedirections: PropTypes.string,
  firstaidequipmentonsite: PropTypes.string,
  firstaidcertlevel: PropTypes.string,
  descexplorationprogram: PropTypes.string,
  proposedstartdate: PropTypes.string,
  proposedenddate: PropTypes.string,
  yearroundseasonal: PropTypes.string,
  landcommunitywatershed: PropTypes.string,
  landprivate: PropTypes.string,
  landlegaldesc: PropTypes.string,
  archsitesaffected: PropTypes.string,
  sandgravelquarryoperations: PropTypes.string,
  storeexplosivesonsite: PropTypes.string,
  bcexplosivespermitissued: PropTypes.string,
  bcexplosivespermitnumber: PropTypes.string,
  bcexplosivespermitexpiry: PropTypes.string,
  campdisturbedarea: PropTypes.string,
  camptimbervolume: PropTypes.string,
  bldgdisturbedarea: PropTypes.string,
  bldgtimbervolume: PropTypes.string,
  stgedisturbedarea: PropTypes.string,
  stgetimbervolume: PropTypes.string,
  fuellubstoreonsite: PropTypes.string,
  fuellubstored: PropTypes.string,
  fuellubstoremethodbulk: PropTypes.string,
  fuellubstoremethodbarrel: PropTypes.string,
  cbsfreclamation: PropTypes.string,
  cbsfreclamationcost: PropTypes.string,
  mechtrenchingreclamation: PropTypes.string,
  mechtrenchingreclamationcost: PropTypes.string,
  expsurfacedrillreclamation: PropTypes.string,
  expsurfacedrillreclcorestorage: PropTypes.string,
  expsurfacedrillreclamationcost: PropTypes.string,
  expaccessreclamation: PropTypes.string,
  expaccessreclamationcost: PropTypes.string,
  surfacebulksampleprocmethods: PropTypes.string,
  surfacebulksamplereclamation: PropTypes.string,
  surfacebulksamplereclsephandl: PropTypes.string,
  surfacebulksamplerecldrainmiti: PropTypes.string,
  surfacebulksamplereclcost: PropTypes.string,
  underexptotalore: PropTypes.string,
  underexptotaloreunits: PropTypes.string,
  underexptotalwaste: PropTypes.string,
  underexptotalwasteunits: PropTypes.string,
  underexpreclamation: PropTypes.string,
  underexpreclamationcost: PropTypes.string,
  placerundergroundoperations: PropTypes.string,
  placerhandoperations: PropTypes.string,
  placerreclamationarea: PropTypes.string,
  placerreclamation: PropTypes.string,
  placerreclamationcost: PropTypes.string,
  sandgrvqrydepthoverburden: PropTypes.string,
  sandgrvqrydepthtopsoil: PropTypes.string,
  sandgrvqrystabilizemeasures: PropTypes.string,
  sandgrvqrywithinaglandres: PropTypes.string,
  sandgrvqryalrpermitnumber: PropTypes.string,
  sandgrvqrylocalgovsoilrembylaw: PropTypes.string,
  sandgrvqryofficialcommplan: PropTypes.string,
  sandgrvqrylandusezoning: PropTypes.string,
  sandgrvqryendlanduse: PropTypes.string,
  sandgrvqrytotalmineres: PropTypes.string,
  sandgrvqrytotalmineresunits: PropTypes.string,
  sandgrvqryannualextrest: PropTypes.string,
  sandgrvqryannualextrestunits: PropTypes.string,
  sandgrvqryreclamation: PropTypes.string,
  sandgrvqryreclamationbackfill: PropTypes.string,
  sandgrvqryreclamationcost: PropTypes.string,
  sandgrvqrygrdwtravgdepth: PropTypes.string,
  sandgrvqrygrdwtrexistingareas: PropTypes.string,
  sandgrvqrygrdwtrtestpits: PropTypes.string,
  sandgrvqrygrdwtrtestwells: PropTypes.string,
  sandgrvqrygrdwtrother: PropTypes.string,
  sandgrvqrygrdwtrmeasprotect: PropTypes.string,
  sandgrvqryimpactdistres: PropTypes.string,
  sandgrvqryimpactdistwater: PropTypes.string,
  sandgrvqryimpactnoise: PropTypes.string,
  sandgrvqryimpactprvtaccess: PropTypes.string,
  sandgrvqryimpactprevtdust: PropTypes.string,
  sandgrvqryimpactminvisual: PropTypes.string,
  cutlinesexplgridtotallinekms: PropTypes.string,
  cutlinesexplgridtimbervolume: PropTypes.string,
  cutlinesreclamation: PropTypes.string,
  cutlinesreclamationcost: PropTypes.string,
  pondswastewatertreatfacility: PropTypes.string,
  freeusepermit: PropTypes.string,
  licencetocut: PropTypes.string,
  timbertotalvolume: PropTypes.string,
  campbuildstgetotaldistarea: PropTypes.string,
  mechtrenchingtotaldistarea: PropTypes.string,
  expsurfacedrilltotaldistarea: PropTypes.string,
  expaccesstotaldistarea: PropTypes.string,
  surfacebulksampletotaldistarea: PropTypes.string,
  placertotaldistarea: PropTypes.string,
  underexptotaldistarea: PropTypes.string,
  sandgrvqrytotaldistarea: PropTypes.string,
  pondstotaldistarea: PropTypes.string,
  reclcostsubtotal: PropTypes.string,
  reclcostexist: PropTypes.string,
  reclcostrecl: PropTypes.string,
  reclcosttotal: PropTypes.string,
  reclareasubtotal: PropTypes.string,
  reclareaexist: PropTypes.string,
  reclarearecl: PropTypes.string,
  reclareatotal: PropTypes.string,
  anyotherinformation: PropTypes.string,
  vfcbcapplicationurl: PropTypes.string,
  messagecreateddate: PropTypes.string,
  processed: PropTypes.string,
  processeddate: PropTypes.string,
  cutlinesexplgriddisturbedarea: PropTypes.string,
  pondsrecycled: PropTypes.string,
  pondsexfiltratedtoground: PropTypes.string,
  pondsdischargedtoenv: PropTypes.string,
  pondsreclamation: PropTypes.string,
  pondsreclamationcost: PropTypes.string,
  sandgrvqrytotalexistdistarea: PropTypes.string,
  nrsosapplicationid: PropTypes.string,
  isblastselect: PropTypes.string,
  istimberselect: PropTypes.string,
  applicant: PropTypes.objectOf(PropTypes.string),
  submitter: PropTypes.objectOf(PropTypes.string),
  documents: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  contacts: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  existing_placer_activity: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  existing_settling_pond: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  proposed_placer_activity: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  proposed_settling_pond: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  surface_bulk_sample_activity: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  sand_grv_qry_activity: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  under_exp_new_activity: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  under_exp_rehab_activity: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  under_exp_surface_activity: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  water_source_activity: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
});