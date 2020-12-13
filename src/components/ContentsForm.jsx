import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import firebase from "../firebase";
import g_login from "../assets/img/btn_google_signin_light_normal_web@2x.png";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

const currencies = [
  {
    value: "USD/JPY",
    label: "USD/JPY",
  },
  {
    value: "EUR/JPY",
    label: "EUR/JPY",
  },
  {
    value: "AUD/JPY",
    label: "AUD/JPY",
  },
  {
    value: "NZD/JPY",
    label: "NZD/JPY",
  },
  {
    value: "CAD/JPY",
    label: "CAD/JPY",
  },
  {
    value: "GBP/JPY",
    label: "GBP/JPY",
  },
  {
    value: "TRY/JPY",
    label: "TRY/JPY",
  },
  {
    value: "ZAR/JPY",
    label: "ZAR/JPY",
  },
  {
    value: "MXN/JPY",
    label: "MXN/JPY",
  },
];

const ContactForm = (props) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  const initialFieldValues = {
    // currencies: '',
    pair: "USD/JPY",
    loss: "",
    min: "",
    max: "",
    num: "",
    amount: "",
    val_sum: 0,
    comment: "",
  };

  var [values, setValues] = useState(initialFieldValues);

  const handleInputChange = (e) => {
    var { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const doChange = (e) => {
    const margin = (values.loss * values.amount * values.num * 10000) / 25;
    const losscut =
      (values.max - (values.max - values.min) / 2 - values.loss) *
      values.num *
      values.amount *
      10000;
    const sum = margin + losscut;

    setValues({
      ...values,
      val_sum: sum,
    });
  };

  const login = (e) => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    props.add(values);
  };

  const classes = useStyles();

  return (
    <div>
      <form autoComplete="off" onSubmit={handleFormSubmit}>
        <div className={classes.root}>
          <div className="contactform">
            <div className="contactform-flex">
              <TextField
                label="通貨ペア"
                align="center"
                id="outlined-select-currency"
                select
                name="pair"
                value={values.pair}
                onChange={handleInputChange}
              >
                {currencies.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className="contactform-flex">
              <TextField
                label="ロスカット値"
                align="center"
                name="loss"
                placeholder=""
                value={values.loss}
                onChange={handleInputChange}
                id="outlined-number"
                // label="Number"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  endAdornment: <InputAdornment>円</InputAdornment>,
                }}
              />
            </div>
            <div className="contactform-flex">
              <TextField
                label="レンジ下値"
                align="center"
                name="min"
                placeholder=""
                value={values.min}
                onChange={handleInputChange}
                id="outlined-number"
                // label="Number"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  endAdornment: <InputAdornment>円</InputAdornment>,
                }}
              />
              <div className="contactform-space">〜</div>
              <TextField
                label="レンジ上値"
                align="center"
                name="max"
                placeholder=""
                value={values.max}
                onChange={handleInputChange}
                id="outlined-number"
                // label="Number"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  endAdornment: <InputAdornment>円</InputAdornment>,
                }}
              />
            </div>
            <div className="contactform-flex">
              <TextField
                label="トラップ本数"
                align="center"
                name="num"
                placeholder=""
                value={values.num}
                onChange={handleInputChange}
                id="outlined-number"
                // label="Number"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  endAdornment: <InputAdornment>本</InputAdornment>,
                }}
              />
            </div>
            <div className="contactform-flex">
              <TextField
                label="注文金額"
                align="center"
                name="amount"
                value={values.amount}
                onChange={handleInputChange}
                id="outlined-number"
                // type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  endAdornment: <InputAdornment>万通貨</InputAdornment>,
                }}
              />
            </div>
            <div className="contactform-button">
              <Button variant="contained" size="large" onClick={doChange}>
                必要資金を計算する
              </Button>
            </div>
            <div className="contactform-result">
              <p>必要資金</p>
              <p className="contactform-money">
                {" "}
                {values.val_sum.toLocaleString()}円{" "}
              </p>
            </div>
            <div className="contactform-flex">
              <TextField
                id="outlined-basic"
                name="comment"
                value={values.comment}
                onChange={handleInputChange}
                style={{ margin: 8 }}
                placeholder="メモ"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />
            </div>
            <div className="contactform-button contactform-save">
              {user ? (
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  size="large"
                  className={classes.button}
                  startIcon={<SaveIcon />}
                >
                  保存する
                </Button>
              ) : (
                <button
                  type="button"
                  onClick={login}
                  className="contactform-login"
                >
                  <img src={g_login} alt="" />
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
