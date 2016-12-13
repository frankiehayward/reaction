import React, { Component, PropTypes } from "react";
import debounce from "lodash/debounce";
import { Translation } from "/imports/plugins/core/ui/client/components";

export default class DiscountForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      discount: this.props.discount,
      validatedInput: false,
      attempts: 0,
      discountApplied: false
    };

    // debounce helper so to wait on user input
    this.debounceDiscounts = debounce(() => {
      const { discount } = this.state;
      Meteor.call("discounts/codes/apply", this.props.cartId, discount, (error, results) => {
        if (results) {
          this.setState({ discountApplied: results, discount: "" });
        } else {
          this.setState({ discountApplied: false });
        }
      });
    }, 500);

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  // handle apply
  renderApplied() {
    return (
      <a onClick={this.handleClick}>
        <Translation defaultValue="Discount submitted." i18nKey={"discounts.submitted"} />
      </a>
    );
  }

  // handle form input
  handleChange(event) {
    const { attempts } = this.state;
    this.setState({ discount: event.target.value, attempts: attempts + 1 });
    this.debounceDiscounts();
  }

  // handle display or not
  handleClick() {
    event.preventDefault();
    this.setState({ validatedInput: true });
  }

  // render discount form
  renderDiscountForm() {
    const { attempts } = this.state;
    let loader;
    if (attempts > 2) {
      loader = <i className="fa fa-circle-o-notch fa-spin fa-fw"/>;
    } else {
      loader = <i className="fa fa-search"/>;
    }
    return (
      <form>
        <label htmlFor="discount-url">
          <Translation defaultValue="Discount Code" i18nKey={"discounts.discountLabel"}/>
        </label>
        <div className="input-group">
          <input autoFocus
            onChange={this.handleChange}
            className="form-control"
            id="discount-input"
            aria-describedby="discount-input-addon"
          />
          <span className="input-group-addon" id="discount-input-addon">
            {loader}
          </span>
        </div>
      </form>
    );
  }
  // have a code link
  renderDiscountLink() {
    return (
      <a onClick={this.handleClick}>
        <Translation defaultValue="Have a code? Enter it here." i18nKey={"discounts.enterItHere"} />
      </a>
    );
  }

  // render discount code input form
  render() {
    const { discountApplied, validatedInput } = this.state;
    if (discountApplied === true && validatedInput === true) {
      return this.renderApplied();
    } else if (validatedInput === true) {
      return this.renderDiscountForm();
    }
    return this.renderDiscountLink();
  }
}

DiscountForm.propTypes = {
  cartId: PropTypes.string,
  discount: PropTypes.string
};
