import React, { Component } from "react";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import Aux from "../../hoc/Aux/Aux";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};

class BurgerBuilder extends Component {
  state = {
    ingredients: {
      salad: 0,
      bacon: 0,
      cheese: 0,
      meat: 0
    },
    purchaseable: false,
    totalPrice: 4,
    purchasing: false,
    loading: false
  };
  updatePurchaseState = () => {
    const ingredients = { ...this.state.ingredients };
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((total, el) => {
        return total + el;
      }, 0);
    this.setState({
      purchaseable: sum > 0 ? true : false
    });
  };
  addIngredientHandler = type => {
    const ingredients = { ...this.state.ingredients };
    ingredients[type] += 1;

    const newTotalPrice = this.state.totalPrice + INGREDIENT_PRICES[type];
    this.setState(
      {
        ingredients,
        totalPrice: newTotalPrice
      },
      () => this.updatePurchaseState()
    );
  };

  removeIngredientHandler = type => {
    const ingredients = { ...this.state.ingredients };
    if (ingredients[type] <= 0) {
      return;
    }
    ingredients[type] -= 1;
    const newTotalPrice = this.state.totalPrice - INGREDIENT_PRICES[type];
    this.setState(
      {
        totalPrice: newTotalPrice,
        ingredients
      },
      () => this.updatePurchaseState()
    );
  };

  purchaseHandler = () => {
    this.setState({
      purchasing: true
    });
  };

  purchaseCancelHandler = () => {
    this.setState({
      purchasing: false
    });
  };
  purchaseContinueHandler = () => {
    this.setState({
      loading: true
    });
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
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
    axios
      .post("/orders.json", order)
      .then(response => {
        console.log(response);
        this.setState({
          loading: false,
          purchasing: false
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ loading: false, purchasing: false });
      });
  };
  render() {
    const disabledInfo = { ...this.state.ingredients };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = (
      <OrderSummary
        ingredients={this.state.ingredients}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler}
        price={this.state.totalPrice}
      />
    );
    if (this.state.loading) {
      orderSummary = <Spinner />;
    }
    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls
          ingredientAdded={this.addIngredientHandler}
          disabled={disabledInfo}
          ingredientsRemoved={this.removeIngredientHandler}
          totalPrice={this.state.totalPrice}
          purchaseable={this.state.purchaseable}
          ordered={this.purchaseHandler}
        />
      </Aux>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);
