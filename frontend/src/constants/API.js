//Network URL's
export const MINE = "/mines";
export const MINE_LIST = "/mines";
export const MINE_LIST_QUERY = (params) => `/mines${params}`;
export const PARTY = "/parties";
export const PARTIES = (search) => (search ? `/parties?search=${search}` : "/parties");
export const MANAGER = "/parties/managers";
export const PERMITTEE = "/permits/permittees";
export const MINE_NAME_LIST = (search) =>
  search ? `/mines/names?search=${search}` : "/mines/names";
export const MINE_STATUS = "/mines/status";
export const MINE_REGION = "/mines/region";
export const MINE_TSF = "/mines/tailings";
export const EDIT_TSF_REPORT = "";
export const REMOVE_EXPECTED_DOCUMENT = "/documents/expected";
export const ADD_MINE_EXPECTED_DOCUMENT = "/documents/expected/mines";
export const DOCUMENT_STATUS = "/documents/expected/status";
export const MINE_TSF_REQUIRED_DOCUMENTS = "/documents/required?category=MINE_TAILINGS";
export const EXPECTED_DOCUMENT = "/documents/expected";
export const MINE_TENURE_TYPES = "/mines/mine_tenure_types";
