import React from "react";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const FeatureItem = ({ title, description, image, link }) => {
  return (
    <>
      {!title ? (
        <Col md={2} xs={12}></Col>
      ) : (
        <Col xs={12} md={4} className="text-center p-4">
          <img src={image} alt={title} />
          <span className="d-block heading__5 pt-4 ">{title}</span>
          <span className="d-block body__1 pb-4">{description}</span>
          <Link to={link} className={`d-block feature__button`}>
            View
          </Link>
        </Col>
      )}
    </>
  );
};

export default FeatureItem;


