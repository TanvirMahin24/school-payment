import React, { useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import FeatureItem from "./FeatureItem/FeatureItem";
import styles from "./Features.module.css";
import { connect } from "react-redux";
import { images } from "./stub/fakeData";

const Features = ({ data }) => {
  // For now, using stub data since we don't have Feature actions
  const stubData = [
    {
      id: 1,
      name: "Payment Management",
      description: "Manage all payments efficiently",
      url: "/dashboard",
      active: true,
    },
  ];

  const displayData = data || stubData;

  if (!displayData || (displayData && displayData.filter((item) => item.active).length === 0)) {
    return <></>;
  }
  return (
    <div className={styles.features} data-aos="fade-top">
      <Container>
        <span className="d-block heading__2 text-center">Payment Features</span>
        <Row className="py-5">
          {displayData
            .filter((item) => item.active)
            .map((feature, i) => (
              <FeatureItem
                title={feature.name}
                description={feature.description}
                image={images[i % 6]}
                link={feature.url}
                key={feature.id}
              />
            ))}
        </Row>
      </Container>
    </div>
  );
};
const mapStateToProps = (state) => ({
  data: state.feature?.feature || null,
});
export default connect(mapStateToProps, null)(Features);


