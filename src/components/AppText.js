import React from "react";
import { StyleSheet, Text } from "react-native";
import { COLORS, LINEHEIGHT, MARGINS, SIZES } from "../utils/styles";
import Markdown from "react-native-markdown-display";
import { RFValue } from "react-native-responsive-fontsize";
/**
 *
 * @param children: string: rendered text
 * @param numberOfLines: integer: caps number of lines to number of lines
 * @param adjustsFontSizeToFit: boolean: determines font size to fit without overflow
 * @param onPress: function: the function that fires on press
 * @param markdown: boolean: whether to use markdown parser or react native text
 * @param rules: object: custom ruleset to override markdown parser, see documentation
 */
// markdown readme: https://www.npmjs.com/package/react-native-markdown-display.
// all the other text style props are booleans & apply styles in a tailwind like fashion.
export default function AppText(props) {
  const {
    children,
    numberOfLines,
    adjustsFontSizeToFit,
    onPress,
    markdown,
    rules,
  } = props;

  const textStyles = [
    styles.default,
    props.small && styles.small,
    props.RFsmall && styles.RFsmall,
    props.h1 && styles.h1,
    props.RFh1 && styles.RFh1,
    props.h2 && styles.h2,
    props.RFh2 && styles.RFh2,
    props.h3 && styles.h3,
    props.RFh3 && styles.RFh3,
    props.h3m && styles.h3m,
    props.RFh3m && styles.RFh3m,
    props.h2m && styles.h2m,
    props.mb1 && styles.mb1,
    props.RFh2m && styles.RFh2m,
    props.mb1 && styles.mb1,
    props.mb2 && styles.mb2,
    props.mb3 && styles.mb3,
    props.mb4 && styles.mb4,
    props.mt1 && styles.mt1,
    props.mt2 && styles.mt2,
    props.mt3 && styles.mt3,
    props.mt4 && styles.mt4,
    props.ml1 && styles.ml1,
    props.ml2 && styles.ml2,
    props.ml3 && styles.ml3,
    props.ml4 && styles.ml4,
    props.mr1 && styles.mr1,
    props.mr2 && styles.mr2,
    props.mr3 && styles.mr3,
    props.mr4 && styles.mr4,
    props.gray && styles.gray,
    props.red && styles.red,
    props.green && styles.green,
    props.shockingPink && styles.shockingPink,
    props.blue && styles.blue,
    props.InkBlue && styles.InkBlue,
    props.flex && styles.flex,
    props.black && styles.black,
    props.white && styles.white,
    props.bold && styles.bold,
    props.underline && styles.underline,
    props.lineThrough && styles.lineThrough,
    props.semibold && styles.semibold,
    props.textAlignCenter && styles.textAlignCenter,
    props.textAlignRight && styles.textAlignRight,
    props.center && styles.center,
    props.lineHeight && styles.lineHeight,
    props.error && styles.error,
    props.uppercase && styles.uppercase,
    props.lowercase && styles.lowercase,
    props.capitalize && styles.capitalize,
    props.textShadow && styles.textShadow,
    props.style,
  ];

  if (markdown) {
    return (
      <Markdown
        {...props}
        style={{
          body: [
            ...textStyles,
            {
              alignSelf: "stretch",
              marginTop: 0,
            },
          ],
          heading1: {
            ...styles.h2,
            fontWeight: "400",
            marginTop: 0,
            marginBottom: 0,
          },
          heading2: {
            ...styles.h2m,
            fontWeight: "500",
            marginTop: MARGINS.mb3,
            marginBottom: 0,
          },
          heading3: {
            ...styles.h3,
            fontWeight: "600",
            marginTop: MARGINS.mb3,
            marginBottom: 0,
          },
          paragraph: {
            justifyContent: props.alignCenter ? "center" : "flex-start",
            marginTop: MARGINS.mb3,
            marginBottom: 0,
          },
          bullet_list: {
            alignSelf: "stretch",
            marginTop: 0,
            marginBottom: 0,
            marginLeft: -8,
          },
          ordered_list: {
            alignSelf: "stretch",
            marginTop: 0,
            marginBottom: 0,
            marginLeft: -8,
          },
          list_item: {
            marginTop: MARGINS.mb3,
            marginBottom: 0,
          },
          strong: {
            fontWeight: "700",
          },
        }}
        rules={rules ? rules : null}
      >
        {children}
      </Markdown>
    );
  } else {
    return (
      <Text
        onPress={onPress}
        style={textStyles}
        numberOfLines={numberOfLines}
        adjustsFontSizeToFit={adjustsFontSizeToFit}
      >
        {children}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  black: {
    color: COLORS.black,
  },
  blue: {
    color: COLORS.darkBlue,
  },
  InkBlue: {
    color: COLORS.InkBlue
  },
  bold: {
    fontWeight: "700",
  },
  center: {
    textAlign: "center",
  },
  default: {
    color: COLORS.primaryDark,
    fontSize: SIZES.body,
    lineHeight: LINEHEIGHT.body,
  },
  error: {
    color: COLORS.errorRed,
  },
  flex: {
    flex: 1,
  },
  gray: {
    color: COLORS.darkGray,
  },
  red: {
    color: COLORS.errorRed
  },
  green: {
    color: COLORS.greenCheck,
  },
  shockingPink: {
    color: COLORS.shockingPink
  },
  h1: {
    fontSize: SIZES.h1,
    lineHeight: LINEHEIGHT.h1,
  },
  RFh1: {
    fontSize: RFValue(SIZES.h1),
    lineHeight: RFValue(LINEHEIGHT.h1),
  },
  h2: {
    fontSize: SIZES.h2,
    lineHeight: LINEHEIGHT.h2,
  },
  RFh2: {
    fontSize: RFValue(SIZES.h2),
    lineHeight: RFValue(LINEHEIGHT.h2),
  },
  h2m: {
    fontSize: SIZES.h2m,
    lineHeight: LINEHEIGHT.h2m,
  },
  RFh2m: {
    fontSize: RFValue(SIZES.h2m),
    lineHeight: RFValue(LINEHEIGHT.h2m),
  },
  h3: {
    fontSize: SIZES.h3,
    lineHeight: LINEHEIGHT.h3,
  },
  RFh3: {
    fontSize: RFValue(SIZES.h3),
    lineHeight: RFValue(LINEHEIGHT.h3),
  },
  h3m: {
    fontSize: SIZES.h3m,
    lineHeight: LINEHEIGHT.h3m,
  },
  RFh3m: {
    fontSize: RFValue(SIZES.h3m),
    lineHeight: RFValue(LINEHEIGHT.h3m),
  },

  mb1: {
    marginBottom: MARGINS.mb1,
  },
  mb2: {
    marginBottom: MARGINS.mb2,
  },
  mb3: {
    marginBottom: MARGINS.mb3,
  },
  mb4: {
    marginBottom: MARGINS.mb4,
  },
  mt1: {
    marginTop: MARGINS.mb1,
  },
  mt2: {
    marginTop: MARGINS.mb2,
  },
  mt3: {
    marginTop: MARGINS.mb3,
  },
  mt4: {
    marginTop: MARGINS.mb4,
  },
  ml1: {
    marginLeft: MARGINS.mb1
  },
  ml2: {
    marginLeft: MARGINS.mb2
  },
  ml3: {
    marginLeft: MARGINS.mb3
  },
  ml4: {
    marginLeft: MARGINS.mb4
  },
  mr1: {
    marginRight: MARGINS.mb1
  },
  mr2: {
    marginRight: MARGINS.mb2
  },
  mr3: {
    marginRight: MARGINS.mb3
  },
  mr4: {
    marginRight: MARGINS.mb4
  },

  semibold: {
    fontWeight: "500",
  },
  small: {
    fontSize: SIZES.small,
    lineHeight: LINEHEIGHT.small,
  },
  RFsmall: {
    fontSize: RFValue(8.5),
    lineHeight: RFValue(LINEHEIGHT.small),
  },
  textAlignCenter: {
    textAlign: "center",
  },
  textAlignRight: {
    textAlign: "right",
  },
  underline: {
    textDecorationLine: "underline",
  },
  white: {
    color: COLORS.white,
  },
  lineThrough: {
    textDecorationLine: 'line-through', textDecorationStyle: 'solid'
  },
  uppercase: { textTransform: 'uppercase' },
  capitalize: { textTransform: 'capitalize' },
  lowercase: { textTransform: 'lowercase' },
  textShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2
  }

});
