import React from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "./StatCard.module.css";

const StatCard = ({ icon, title, count, link, variant }) => {
  const variantClass = variant === "success" ? styles.crdSuccess : variant === "danger" ? styles.crdDanger : "";
  return (
    <div className={`mt-3 mt-md-0 ${styles.crd} ${variantClass}`}>
      <Row>
        <Col xs={3}>
          <div className={styles.icon}>{icon}</div>
        </Col>
        <Col xs={9}>
          {link ? (
            <Link to={link} className={styles.link}>
              <div className={styles.title}>{title}</div>
            </Link>
          ) : (
            <div className={styles.title}>{title}</div>
          )}

          {count ? <div className={styles.count}>{count}</div> : <></>}
        </Col>
      </Row>
    </div>
  );
};

export default StatCard;


