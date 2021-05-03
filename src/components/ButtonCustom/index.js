import React from "react";
import styled from "styled-components";

const Btn = styled.button`
  width: ${(props) => (props.width ? props.width : "100%")};
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : 400)};
  text-align: ${(props) => (props.textAlign ? props.textAlign : "center")};
  font-family: "Roboto", sans-serif;
  padding: ${(props) => (props.padding ? props.padding : "0")};
  height: ${(props) => (props.height ? props.height : "62px")};
  display: block;
  outline: none;
  /* color: "white"; */
  flex-shrink: 0;
  margin-right: ${(props) => (props.mr ? `${props.mr}px` : "0")};
  margin-left: ${(props) => (props.ml ? `${props.ml}px` : "0")};
  margin-top: ${(props) => (props.mt ? `${props.mt}px` : "0")};
  margin-bottom: ${(props) => (props.mb ? `${props.mb}px` : "0")};
  background-color: ${(props) =>
    props.disabled
      ? "#092E7D"
      : props.backgroundColor
      ? props.backgroundColor
      : "#0d6efd"};
  color: ${(props) =>
    props.disabled ? "white" : props.textColor ? props.textColor : "white"};
  cursor: pointer;
  font-size: ${(props) => (props.fontSize ? props.fontSize : "28px")};
  border: none;
  &:hover {
    background-color: ${(props) => (props.disabled ? "#092E7D" : "#0b5ed7")};
  }
  border-radius: 15px;
`;

export const ButtonCustom = ({
  children,
  width,
  fontWeight,
  textAlign,
  padding,
  height,
  mr,
  fontSize,
  ml,
  mt,
  mb,
  backgroundColor,
  textColor,
  disabled,
  type,
  onClick
}) => (
  <Btn
    width={width}
    fontWeight={fontWeight}
    textAlign={textAlign}
    padding={padding}
    fontSize={fontSize}
    height={height}
    mr={mr}
    ml={ml}
    mt={mt}
    mb={mb}
    backgroundColor={backgroundColor}
    textColor={textColor}
    disabled={disabled}
    type={type}
    onClick={onClick}
  >
    {children}
  </Btn>
);
