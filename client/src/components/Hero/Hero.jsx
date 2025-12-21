import React from "react";
import HeroImg from "../../Assets/Hero/heroImg.png";
import styles from "./Hero.module.css";
import { orgInfo } from "../../constants/info";

const Hero = () => {
  return (
    <div className={styles.hero}>
      <div className={`${styles.left} my-auto`}>
        <div className="pb-5">
          <h1 className="heading__1">{orgInfo.ORG_NAME}</h1>
        </div>
      </div>
      <div className={styles.right}>
        <img src={HeroImg} alt="hero" />
      </div>
    </div>
  );
};

export default Hero;


