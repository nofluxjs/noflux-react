import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as createReactClass from 'create-react-class';
import * as PropTypes from 'prop-types';
import { connect } from '..';

// Component

@connect
class AppComponent extends React.Component<{ pizza: number }, {}> {
  render() {
    return <div>{this.props.pizza}</div>;
  }
}

class AppComponentFunc extends React.Component<{ pizza: number }, {}> {
  render() {
    return <div>{this.props.pizza}</div>;
  }
}
const ConnectAppComponentFunc = connect(AppComponentFunc);

// Pure Component

@connect
class AppPureComponent extends React.PureComponent<{ pizza: number }, {}> {
  render() {
    return <div>{this.props.pizza}</div>;
  }
}


class AppPureComponentFunc extends React.PureComponent<{ pizza: number }, {}> {
  render() {
    return <div>{this.props.pizza}</div>;
  }
}
const ConnectAppPureComponentFunc = connect(AppPureComponentFunc);

// Stateless Component

const AppStateless = (props: { pizza: number }) => {
  return <div>{props.pizza}</div>;
};
const ConnectAppStateless = connect(AppStateless);

// Classic Component

const AppClassic = createReactClass({
	getDefaultProps() {
		return { pizza: 0 };
	},
  propTypes: {
    pizza: PropTypes.number,
  },
	render() {
		return <div>{this.props.pizza}</div>;
	},
});

const ConnectAppClassic = connect(AppClassic);

const App = () => (
  <React.Fragment>
    <AppComponent pizza={1} />
    <AppPureComponent pizza={1} />
    <AppComponentFunc pizza={1} />
    <ConnectAppComponentFunc pizza={1} />
    <ConnectAppPureComponentFunc pizza={1} />
    <ConnectAppStateless pizza={1} />
    <AppClassic pizza={1} />
    <ConnectAppClassic pizza={1} />
  </React.Fragment>
)
