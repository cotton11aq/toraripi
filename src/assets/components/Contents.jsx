import React, { useState, useEffect } from "react";
import { ContentsForm } from "./index";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import firebase from "firebase/app";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { db } from "../../firebase";

const columns = [
  {
    id: "pair",
    className: "calc-none",
    label: "通貨ペア",
    minWidth: 100,
    align: "center",
  },
  { id: "loss", label: "ロスカット値", minWidth: 100, align: "center" },
  {
    id: "min-max",
    label: "レンジ",
    minWidth: 100,
    align: "center",
    maxWidth: 10,
  },
  {
    id: "num",
    label: "トラップ本数",
    minWidth: 100,
    align: "center",
  },
  {
    id: "amount",
    label: "注文金額",
    minWidth: 100,
    align: "center",
  },
  {
    id: "val_sum",
    label: "必要資金",
    minWidth: 100,
    align: "center",
  },
  {
    id: "comment",
    label: "メモ",
    minWidth: 140,
    align: "center",
  },
  {
    id: "delete",
    label: "削除",
    minWidth: 100,
    align: "center",
  },
];

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
  },
  root: {
    width: "100%",
    flexGrow: 1,
    maxHeight: 650,
  },
  header: {
    marginBottom: 5,
  },
  container: {
    maxHeight: 650,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

const Contacts = () => {
  const classes = useStyles();

  const [currentId, setCurrentId] = useState("");
  const [rows, setRows] = useState([]);

  var user = firebase.auth().currentUser;
  var uid;

  if (user != null) {
    uid = user.uid;
  }

  const onDelete = (id) => {
    if (currentId === "")
      db.ref(`user/${uid}/${id}`).remove((err) => {
        if (err) console.log(err);
        else setCurrentId("");
      });
  };

  const add = (obj) => {
    if (currentId === "")
      db.ref(`user/${uid}`).push(obj, (err) => {
        if (err) console.log(err);
        else setCurrentId("");
      });
    else
      db.ref(`user/${uid}/${currentId}`).set(obj, (err) => {
        if (err) console.log(err);
        else setCurrentId("");
      });
  };

  useEffect(() => {
    db.ref(`user/${uid}`)
      .orderByKey()
      .on("value", (snapshot) => {
        if (snapshot.val() != null) {
          setRows({
            ...snapshot.val(),
          });
        }
      });
  }, [uid]);

  return (
    <>
      <div className="contacts-wrapper">
        <div className="contacts-left">
          <ContentsForm {...{ currentId, add }}></ContentsForm>
        </div>
        <div className="contacts-right">
          <Paper className={classes.root}>
            <TableContainer className={classes.container}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(rows).map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row}>
                        <TableCell align="center">{rows[row].pair}</TableCell>
                        <TableCell align="center">
                          {rows[row].loss} 円
                        </TableCell>
                        <TableCell className="calc-none" align="center">
                          {rows[row].min} 〜 {rows[row].max} 円
                        </TableCell>
                        <TableCell className="calc-none" align="center">
                          {rows[row].num} 本
                        </TableCell>
                        <TableCell className="calc-none" align="center">
                          {rows[row].amount} 万通貨
                        </TableCell>
                        <TableCell align="center">
                          {rows[row].val_sum.toLocaleString()} 円
                        </TableCell>
                        <TableCell className="calc-none" align="center">
                          {rows[row].comment}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            aria-label="delete"
                            // className="btn text-danger"
                            onClick={() => {
                              onDelete(row);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
      </div>
    </>
  );
};

export default Contacts;
