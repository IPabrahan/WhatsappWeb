import "../css/messages.css";

/* eslint-disable react/prop-types */
function Message({ text, sender }) {
  
  console.log(sender, "sender")
  console.log(sessionStorage.getItem("id"))
  return (
    < div className={`message ${sender == sessionStorage.getItem("id") ? "outgoing" : "incoming"}`
    }>
      <p>{text}</p>
    </div >
  );
}

export default Message;
