'use strict';
import React, {Component} from "react";
import {View, TextInput, StyleSheet} from "react-native";
import PropTypes from 'prop-types';

import Underline from './Underline';
import FloatingLabel from './FloatingLabel';

export default class TextField extends Component {
  constructor(props: Object, context: Object) {
    super(props, context);
    this.state = {
      isFocused: false,
      text: props.value,
      height: props.height,
    };
  }
  focus() {
    if(this.props.disabled){
      this.props.callback();
    } else {
      this.refs.input.focus();
    }
  }
  blur() {
    this.refs.input.blur();
  }
  isFocused() {
    return this.state.isFocused;
  }
  measureLayout(...args){
    this.refs.wrapper.measureLayout(...args)
  }

  componentDidMount() {
    // force to animate if it has isFocused
    const { disabled, isFocused, value } = this.props;


    // auto expand if that input text has value (text)
    if (isFocused || value) {
      this.refs.underline.expandLine();
        if(this.refs.floatingLabel) {
          this.refs.floatingLabel.floatLabel();
        }
    }

  }

  componentWillReceiveProps({
    text: nextText,
    isFocused: nextIsFocused,
    disabled: nextDisable,
    height: nextHeight,
    value: nextValue,
  }: Object) {
    const { text, height, isFocused, disabled, value } = this.props;
    if (nextDisable) {
      this.refs.input.setNativeProps({'editable': false});
    } else {
      this.refs.input.setNativeProps({'editable': true});
    }

    if(text !== nextValue){
      nextValue.length !== 0 && this.refs.floatingLabel ?
        this.refs.floatingLabel.floatLabel()
        : this.refs.floatingLabel.sinkLabel();
      this.setState({text: nextValue});
    }

    if(height !== nextHeight){
      this.setState({height: nextHeight});
    }

    // force to animate if it has isFocused
    if (nextIsFocused) {
      this.refs.underline.expandLine();
        if(this.refs.floatingLabel) {
          this.refs.floatingLabel.floatLabel();
        }
    } else {
      // there is no text
      if (!(value || nextValue)) {
        this.refs.underline.shrinkLine();
      !this.state.text.length && this.refs.floatingLabel.sinkLabel();
      }
    }
  }

  render() {
    const PADDING_BOTTOM = 30;
    const {
      label,
      highlightColor,
      duration,
      labelColor,
      borderColor,
      textColor,
      textFocusColor,
      textBlurColor,
      onFocus,
      onBlur,
      onChangeText,
      onChange,
      value,
      dense,
      inputStyle,
      wrapperStyle,
      labelStyle,
      height,
      autoGrow,
      multiline,
      isFocused,
      labelAnimatedOpts,
      textPadding = 0,
      keyboardType = 'default',
      ...props
    } = this.props;
    return (
      <View style={[dense ? styles.denseWrapper : styles.wrapper, this.state.height ? {height: undefined}: {height: this.state.height + PADDING_BOTTOM}, wrapperStyle]} ref="wrapper">
        <TextInput
          keyboardType={keyboardType}
          style={[dense ? styles.denseTextInput : styles.textInput, {
            color: textColor
          }, (this.state.isFocused && textFocusColor) ? {
            color: textFocusColor
          } : {}, (!this.state.isFocused && textBlurColor) ? {
            color: textBlurColor
          } : {}, inputStyle]}
          multiline={multiline}
          onFocus={() => {
            this.setState({isFocused: true});
            this.refs.underline.expandLine();
            onFocus && onFocus();
            this.refs.floatingLabel.floatLabel();
          }}
          onBlur={() => {
            this.setState({isFocused: false});
            !this.state.text.length && this.refs.floatingLabel.sinkLabel();
            this.refs.underline.shrinkLine();
            onBlur && onBlur();
          }}
          onChangeText={(text) => {
            this.setState({text});
            this.setState({isFocused: true});
            onChangeText && onChangeText(text);
          }}
          ref="input"
          value={this.state.text}
          editable={!this.props.disabled}
          {...props}
        />
        <Underline
          ref="underline"
          isFocused={this.state.isFocused}
          duration={duration}
          highlightColor={highlightColor}
          borderColor={borderColor}
        />
        <FloatingLabel
          isFocused={this.state.isFocused}
          ref="floatingLabel"
          focusHandler={this.focus.bind(this)}
          label={label}
          labelColor={labelColor}
          highlightColor={highlightColor}
          duration={duration}
          dense={dense}
          hasValue={(this.state.text.length) ? true : false}
          style={labelStyle}
          labelAnimatedOpts={labelAnimatedOpts}
          textPadding={textPadding}
        />
      </View>
    );
  }
}

TextField.propTypes = {
  duration: PropTypes.number,
  label: PropTypes.string,
  highlightColor: PropTypes.string,
  labelColor: PropTypes.string,
  borderColor: PropTypes.string,
  textColor: PropTypes.string,
  textFocusColor: PropTypes.string,
  textBlurColor: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChangeText: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.string,
  dense: PropTypes.bool,
  inputStyle: PropTypes.object,
  wrapperStyle: PropTypes.object,
  labelStyle: PropTypes.object,
  multiline: PropTypes.bool,
  autoGrow: PropTypes.bool,
  height: PropTypes.oneOfType([PropTypes.oneOf(undefined), PropTypes.number])
};

TextField.defaultProps = {
  duration: 200,
  labelColor: '#9E9E9E',
  borderColor: '#E0E0E0',
  textColor: '#000',
  value: '',
  dense: false,
  underlineColorAndroid: 'rgba(0,0,0,0)',
  multiline: false,
  autoGrow: false,
  height: undefined
};

const styles = StyleSheet.create({
  wrapper: {
    height: 72,
    paddingTop: 30,
    paddingBottom: 7,
    position: 'relative'
  },
  denseWrapper: {
    height: 60,
    paddingTop: 28,
    paddingBottom: 4,
    position: 'relative'
  },
  textInput: {
    fontSize: 16,
    height: 34,
    lineHeight: 22,
    paddingBottom: -1,
    textAlignVertical: 'top'
  },
  denseTextInput: {
    fontSize: 13,
    height: 27,
    lineHeight: 24,
    paddingBottom: 3,
    textAlignVertical: 'top'
  }
});
