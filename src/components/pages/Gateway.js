import React from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Col, Card } from 'antd';

export default class Gateway extends React.PureComponent {
  render() {
    return (
      <div>
        <Row gutter={16} type="flex" justify="space-around" align="top">
          <Col span={24}>
            <h2>I want to...</h2>
            <hr />
          </Col>

          <Col xs={24} sm={8}>
            <Card>
              <ul>
                <li>...log something to remote consoles.</li>
                <li>...temporarily flip a remote Firefox preference.</li>
                <li>
                  ...permanently roll out a remote Firefox preference change.
                </li>
              </ul>

              <NavLink to="/recipe/">
                Go to the Recipe Listing to start a new study.
              </NavLink>
            </Card>
          </Col>

          <Col xs={24} sm={8}>
            <Card>
              <ul>
                <li>
                  ...manage system addons used in conjunction with opt-out
                  studies.
                </li>
              </ul>

              <NavLink to="/extension/">
                Go to Extension Listing to upload or edit existing study addons.
              </NavLink>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
