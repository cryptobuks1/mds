import React from "react";
import { PropTypes } from "prop-types";
import { Field } from "redux-form";
import { Row, Col, Table } from "antd";
import * as Strings from "@/constants/strings";
import RenderField from "@/components/common/RenderField";
import RenderAutoSizeField from "@/components/common/RenderAutoSizeField";

const propTypes = {
  isViewMode: PropTypes.bool.isRequired,
  initialValues: PropTypes.objectOf(PropTypes.string).isRequired,
};

export const CutLines = (props) => {
  const columns = [
    {
      title: "Total Line(km)",
      dataIndex: "total",
      key: "total",
      render: (text) => <div title="Access Type">{text}</div>,
    },
    {
      title: "Disturbed Area (ha)",
      dataIndex: "disturbedArea",
      key: "disturbedArea",
      render: (text) => <div title="Disturbed Area (ha)">{text}</div>,
    },
    {
      title: "Merchantable timber volume (m3)",
      dataIndex: "timberVolume",
      key: "timberVolume",
      render: (text) => <div title="Merchantable timber volume (m3)">{text}</div>,
    },
  ];

  const transformData = (activities) =>
    activities.map((activity) => ({
      total: activity.cut_line_length || Strings.EMPTY_FIELD,
      disturbedArea: activity.disturbed_area || Strings.EMPTY_FIELD,
      timberVolume: activity.timber_volume || Strings.EMPTY_FIELD,
    }));

  return (
    <div>
      <br />
      <h4>Exploration Grid</h4>
      <Table
        align="left"
        pagination={false}
        columns={columns}
        dataSource={transformData(props.initialValues.details ? props.initialValues.details : [])}
        locale={{
          emptyText: "No data",
        }}
      />
      <br />
      <h4>Reclamation Program</h4>
      <Row gutter={16}>
        <Col md={12} sm={24}>
          <div className="field-title">
            Proposed reclamation and timing for this specific activity**
          </div>
          <Field
            id="reclamation_description"
            name="reclamation_description"
            component={RenderAutoSizeField}
            disabled={props.isViewMode}
          />
        </Col>
        <Col md={12} sm={24}>
          <div className="field-title">
            Estimated Cost of reclamation activities described above**
          </div>
          <Field
            id="reclamation_cost"
            name="reclamation_cost"
            component={RenderField}
            disabled={props.isViewMode}
          />
        </Col>
      </Row>
    </div>
  );
};

CutLines.propTypes = propTypes;

export default CutLines;
