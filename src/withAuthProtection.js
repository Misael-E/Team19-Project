const withAuthProtection = redirectPath => WrappedComponent => {
  class WithAuthProtection extends React.Component {
    componentDidMount() {
      // use history from parent.
      const { history } = this.props;
      if (!firebase.auth().currentUser) {
        // no auth at the beginning of the app, redirect them to
           login.
        return history.push(redirectPath);
      }
    }
    componentWillReceiveProps(nextProps) {
      const { me, history } = this.props;
      const { me: nextMe } = nextProps;
      if (me && !nextMe) {
        // this case is a must,
        // if user stay at auth route while they signing out
        // we must take them to login again immediately.
        history.push(redirectPath)
      }
    }
    render() {
      const { me } = this.props;
      if (!me) {
        // don't render anything if no auth
        return null
      }
      return <WrappedComponent {...this.props} />
    }
  }

  return WithAuthProtection
}
