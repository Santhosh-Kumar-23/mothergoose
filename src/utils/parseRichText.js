import React from "react";
import { View, Image, Linking } from "react-native";
import AppText from "../components/AppText";
import Link from "../components/Link";
import { mvs } from 'react-native-size-matters';

// import * as Linking from "expo-linking";

// THIS IS BASED ON THIS EXAMPLE BUT REFACTORED FOR MG: https://robertbattaglia.com/parsing-contentfuls-rich-text-editor-response/
// SOURCE CODE FOR EXAMPLE: https://github.com/RobertBattaglia/portfolio/blob/master/src/utils/convertBlogBodyToElements.js

// LOL FINALLY FOUND A PRODUCTION USE FOR RECURSION
// Basically this parses the tree of richtext from contentful into our custom components using a recursive depth-first search. So this is how we handle the article body field for education modules.

const convertRichTextToAppElements = (raw) => {
  const parseNode = (node) => {
    const { nodeType, content, data, value, marks } = node;
    const mappedContent = content && content.map(parseNode);
    let element = null;
    if (nodeType === "document") {
      element = <>{mappedContent}</>;
    } else if (nodeType === "paragraph") {
      element = <AppText mb2>{mappedContent}</AppText>;
    } else if (nodeType === "heading-1") {
      element = (
        <AppText h1 bold blue textAlignCenter mb3>
          {mappedContent}
        </AppText>
      );
    } else if (nodeType === "heading-2") {
      element = (
        <AppText h2 bold blue textAlignCenter mb3>
          {mappedContent}
        </AppText>
      );
    } else if (
      nodeType === "heading-3" ||
      nodeType === "heading-4" ||
      nodeType === "heading-5" ||
      nodeType === "heading-6"
    ) {
      element = (
        <AppText h3 semibold blue textAlignCenter mb3>
          {mappedContent}
        </AppText>
      );
    } else if (nodeType === "list-item") {
      element = <AppText mb2>° {mappedContent}</AppText>;
    } else if (
      nodeType === "unordered-list" ||
      nodeType === "ordered-list" ||
      nodeType === "blockquote"
    ) {
      element = (
        <AppText mb2 blue>
          {mappedContent}
        </AppText>
      );
    } else if (nodeType === "hr") {
      element = (
        <View style={{ height: 4, width: "100%", backgroundColor: "black" }} />
      );
    } else if (nodeType === "hyperlink") {
      element = (
        <Link negMB3 onPress={() => Linking.openURL(data.uri)}>
          {mappedContent}
        </Link>
      );
    }
    else if (nodeType === "embedded-asset-block") {
      // const {
      //   target: {
      //     sys: { id },
      //   },
      // } = data;
      // for (const asset of assets) {
      //   if (id === asset.node.contentful_id) {
      //     src = asset.node.file.url;
      //     description = asset.node.description;
      //     break;
      //   }
      // }
      element = <Image source={{ uri: data?.imageURL }} style={{ height: mvs(300), width: "100%", resizeMode: "contain" }} />;
    } else if (nodeType === "entry-hyperlink") {
      const {
        target: {
          sys: { id },
        },
      } = data;
      let articleData;

      element = <AppText>{articleData}</AppText>;
    } else if (nodeType === "text") {
      // TODO: REEXAMINE IF WE NEED THIS AT ALL
      const parts = value.split("`");
      if (parts.length < 3) {
        element = value;
      } else {
        const children = [];
        for (let i = 0; i < parts.length; i++) {
          if (i % 2 === 0) {
            children.push(parts[i]);
          } else {
            children.push(<AppText>{parts[i]}</AppText>);
          }
        }
        element = <AppText>{children}</AppText>;
      }

      marks.forEach(({ type }) => {
        if (type === "bold") {
          element = <AppText bold>{element}</AppText>;
        } else if (type === "italic") {
          element = <AppText>{element}</AppText>;
        } else if (type === "underline") {
          element = <AppText underline>{element}</AppText>;
        }
      });
    }

    return element;
  };

  const result = parseNode(raw);
  return result;
};

export default convertRichTextToAppElements;
