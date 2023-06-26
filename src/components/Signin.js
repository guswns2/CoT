import { useState,useEffect, useRef } from "react";
import { TextField, Input, Icon } from "@mui/material";
import "./css/Signin.css";
import { useNavigate } from "react-router";
import axios from "axios";

const Signin = () => {
  
  useEffect(() => {
    const scrollAnimElements = document.querySelectorAll(
      "[data-animate-on-scroll]"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            const targetElement = entry.target;
            targetElement.classList.add("animate");
            observer.unobserve(targetElement);
          }
        }
      },
      {
        threshold: 0.15,
      }
    );
   
    for (let i = 0; i < scrollAnimElements.length; i++) {
      observer.observe(scrollAnimElements[i]);
    }

    return () => {
      for (let i = 0; i < scrollAnimElements.length; i++) {
        observer.unobserve(scrollAnimElements[i]);
      }
    };
  }, []);

  //회원가입 기능
  const nav = useNavigate();
  const idRef = useRef();
  const pwRef = useRef();
  const nameRef = useRef();
  const companyRef = useRef();
  const comaddRef = useRef();
  const co2Ref = useRef();

  const handleSignin = (e) => {
    e.preventDefault();
    console.log("handleSignin!");

    console.log(idRef.current.value);
    console.log(pwRef.current.value);
    console.log(nameRef.current.value);
    console.log(companyRef.current.value);
    console.log(comaddRef.current.value);
    console.log(co2Ref.current.value);

    axios
      .post("http://127.0.0.1:3001/Signin", {
        ID: idRef.current.value,
        PW: pwRef.current.value,
        name: nameRef.current.value,
        company: companyRef.current.value,
        comadd: comaddRef.current.value,
        co2: co2Ref.current.value
      })
      .then((result) => {
        console.log("데이터 보내기 성공!", result.data.result);
        
        nav("/Login");
      }) // axios로 보낼 위치에 데이터 보내기를 성공하면 then
      .catch(() => {
        console.log("데이터 보내기 실패!");
      }); // aixos로 보낼 위치에 데이터 보내기를 실패하면 catch
  };

  return (
    <form onSubmit={handleSignin} method="post">
      <div className="signin" data-animate-on-scroll>
        <div className="frame">
          <div className="rec1">
            <section className="rec-item" id="LoginContainer" />
          </div>
          <button className="signbtn1" type="submit">
            <button className="signbtn-item" />
            <div className="singin1">Singin</div>
          </button>
          <TextField
            className="name"
            sx={{ width: 365.3948669433594 }}
            color="primary"
            variant="standard"
            type="text"
            label="Name"
            placeholder="Name"
            size="medium"
            margin="none"
            id="name"
            name="name"
            inputRef={nameRef}
          />
          <TextField
            className="id1"
            sx={{ width: 365.3948669433594 }}
            color="primary"
            variant="standard"
            type="text"
            label="ID"
            placeholder="ID"
            size="medium"
            margin="none"
            id="ID"
            name="ID"
            inputRef={idRef}
          />
          <TextField
            className="pw1"
            sx={{ width: 365.3946228027344 }}
            color="primary"
            variant="standard"
            type="text"
            label="PW"
            placeholder="PW"
            size="medium"
            margin="none"
            id="PW"
            name="PW"
            inputRef={pwRef}
          />
          <TextField
            className="company"
            sx={{ width: 365.3946228027344 }}
            color="primary"
            variant="standard"
            type="text"
            label="회사명"
            placeholder="회사명"
            size="medium"
            margin="none"
            id="company"
            name="company"
            inputRef={companyRef}
          />
          <TextField
            className="comadd"
            sx={{ width: 365.3946228027344 }}
            color="primary"
            variant="standard"
            type="text"
            label="회사주소"
            placeholder="회사주소"
            size="medium"
            margin="none"
            id="comadd"
            name="comadd"
            inputRef={comaddRef}
          />
          <TextField
            className="co2"
            sx={{ width: 365.3946228027344 }}
            color="primary"
            variant="standard"
            type="text"
            label="탄소배출권"
            placeholder="탄소배출권(tco2)"
            size="medium"
            margin="none"
            id="co2"
            name="co2"
            inputRef={co2Ref}
          />
          <div className="sign-in">Sign in</div>
          <img className="signinicon" alt="" src="../icon.svg" />
        </div>
      </div>
    </form>
  );
};

export default Signin;