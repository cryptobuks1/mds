import React from "react";
import PropTypes from "prop-types";

import { Spin, List, Icon } from "antd";

import CommentEditor from "@/components/common/comments/CommentEditor";
import Comment from "@/components/common/comments/Comment";
import * as Style from "@/constants/styles";

const propTypes = {
  loading: PropTypes.bool,
  renderAdd: PropTypes.bool,
  comments: PropTypes.arrayOf(PropTypes.any).isRequired,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
};

const defaultProps = {
  renderAdd: true,
  loading: false,
  onChange: () => {},
  onSubmit: () => {},
};
const antIcon = (
  <Icon type="loading" style={{ fontSize: 30, color: Style.COLOR.mediumGrey }} spin />
);
const CommentPanel = (props) => (
  <React.Fragment>
    {!props.loading ? (
      <List
        className="comment-list"
        itemLayout="horizontal"
        dataSource={props.comments}
        locale={{ emptyText: <Icon /> }}
        renderItem={(item) => (
          <li key={item.key}>
            <Comment author={item.author} datetime={item.datetime} actions={item.actions}>
              {item.content}
            </Comment>
          </li>
        )}
      />
    ) : (
      <div className="center margin-xlarge">
        <Spin id="spinner" indicator={antIcon} />
      </div>
    )}
    {props.renderAdd && <CommentEditor onChange={props.onChange} onSubmit={props.onSubmit} />}
  </React.Fragment>
);

CommentPanel.defaultProps = defaultProps;
CommentPanel.propTypes = propTypes;

export default CommentPanel;
