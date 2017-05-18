'use strict';
import React, {Component, PropTypes} from "react";
import {View, StyleSheet, Animated} from "react-native";

export default class Underline extends Component {
  constructor(props: Object) {
    super(props);
    this.state = {
      lineLength: new Animated.Value(0),
      lineHeight: new Animated.Value(1),
    };
    this.wrapperWidth = 0;
  }
  componentDidMount() {
    requestAnimationFrame(() => {
      if (this.refs.wrapper == null) {
        return;
      }
      const container = this.refs.wrapper;  // un-box animated view
      container.measure((left, top, width, height) => {
        this.wrapperWidth = width;
      });
    });
  }
  expandLine() {
    Animated.parallel([
      Animated.timing(this.state.lineLength, {
        toValue: this.wrapperWidth,
        duration: this.props.duration
      }),
      Animated.timing(this.state.lineHeight, {
        toValue: 1,
        duration: this.props.duration
      }),
    ]).start();
  }
  shrinkLine() {
    Animated.parallel([
      Animated.timing(this.state.lineLength, {
        toValue: 0,
        duration: this.props.duration
      }),
      Animated.timing(this.state.lineHeight, {
        toValue: 1,
        duration: this.props.duration
      }),
    ]).start();
  }

  render() {
    let {
      borderColor,
      highlightColor,
      isFocused,
    } = this.props;
    return (
      <View
        style={[styles.underlineWrapper, {
          backgroundColor: borderColor
        }]}
        ref="wrapper"
      >
        <Animated.View
          style={[{
            width: this.state.lineLength,
            height: this.state.lineHeight,
            backgroundColor: isFocused ? highlightColor : borderColor
          }]}>
        </Animated.View>
      </View>
    );
  }
}

Underline.propTypes = {
  duration: PropTypes.number,
  highlightColor: PropTypes.string,
  borderColor: PropTypes.string
};

const styles = StyleSheet.create({
  underlineWrapper: {
    alignItems: 'center'
  }
});
