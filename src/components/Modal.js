import { TextField } from "@mui/material";
import "./css/Modal.css";
import { useRef } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

const Modal = (props) => {
  const { setModalOpen } = props;

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = "unset";
  };

  //모달창 기능
  const elecRef = useRef();
  const co2Ref = useRef();
  const nav = useNavigate();

  const handleModal = (e) => {
    e.preventDefault();
    console.log(elecRef.current.value);
    console.log(co2Ref.current.value);

    axios
      .post("http://127.0.0.1:3001/Modal", {
        elec: elecRef.current.value,
        co2: co2Ref.current.value,
      })
      .then((result) => {
        console.log("데이터 보내기 성공!", result.data.id);
        nav("/");
      }) // axios로 보낼 위치에 데이터 보내기를 성공하면 then
      .catch(() => {
        console.log("데이터 보내기 실패!");
      });
  };
  return (
    <form onSubmit={handleModal} method="post">
      <div className="Mcontainer">
        <div className="modal">
          <div className="statedefault-iconoff1">
            <b className="b2">전력사용량</b>
            <TextField
              className="text-field"
              color="primary"
              variant="outlined"
              type="number"
              size="small"
              margin="none"
              id="elec"
              name="elec"
              inputRef={elecRef}
            />
          </div>
          <div className="statedefault-iconoff">
            <b className="b2">탄소배출량</b>
            <TextField
              className="text-field"
              color="primary"
              variant="outlined"
              type="number"
              size="small"
              margin="none"
              id="co2"
              name="co2"
              inputRef={co2Ref}
            />
          </div>
          <button className="vector-wrapper" onClick={closeModal}>
            <img className="vector-icon" alt="" src="../vector2.svg" />
          </button>
          <button className="stateactive-typeprimary" type="submit">
            <b className="b2">입력</b>
          </button>
        </div>
      </div>
    </form>
  );
};
export default Modal;
