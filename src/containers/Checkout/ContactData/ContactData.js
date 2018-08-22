import React, { Component } from "react";
import Button from "../../../components/UI/Button/Button";
import classes from "./ContactData.css";
import axios from "../../../axios-orders";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import { withRouter } from "react-router-dom";

class ContactData extends Component {
  state = {
    name: "",
    email: "",
    address: {
      street: "",
      postalCode: ""
    },
    loading: false
  };
  orderHandler = event => {
    event.stopPropagation();
    event.preventDefault();

    this.setState({
      loading: true
    });
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      customer: {
        name: "Shivam Kumar",
        address: {
          street: "Teststreet12",
          zipcode: "122017",
          country: "India"
        },
        emailId: "test@test.com"
      },
      deliveryMethod: "fastest"
    };
    console.log(order);
    axios
      .post("/orders.json", order)
      .then(response => {
        this.setState({
          loading: false
        });
        this.props.history.push("/");
      })
      .catch(err => {
        console.log(err);
        this.setState({ loading: false });
      });
  };
  render() {
    let form = (
      <form action="">
        <Input
          inputtype="input"
          type="text"
          name="name"
          id="name"
          placeholder="Your name"
          label="Name"
        />
        <Input
          inputtype="input"
          type="email"
          name="email"
          id="email"
          placeholder="Your Email"
          label="Email Address"
        />
        <Input
          inputtype="input"
          type="text"
          name="street"
          id="street"
          placeholder="Your Street"
          label="Street"
        />
        <Input
          inputtype="input"
          type="text"
          name="postalCode"
          id="postalCode"
          placeholder="Your Postal Code"
          label="Postal Code"
        />
        <Button btnType="Success" clicked={this.orderHandler}>
          ORDER
        </Button>
      </form>
    );
    if (this.state.loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your contact data</h4>
        {form}
      </div>
    );
  }
}

export default withRouter(ContactData);
