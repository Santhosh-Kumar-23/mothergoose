import React, { useState, useContext } from "react";
import OnboardingFormTemplate from "../../components/OnboardingFormTemplate";
import validator from "validator";
import { AppContext } from "../../context";
import { createPassword, Sendhealthix } from "../../api";
// import { captureScreen } from "react-native-view-shot";
import RNFetchBlob from 'rn-fetch-blob';
import { HtmlToPDF } from './CreateHealthixForm';
import { decode } from "base64-arraybuffer";
import * as AWS from 'aws-sdk';
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

var awsCred = new AWS.Credentials({
  accessKeyId: process.env.AWS_ACCESSKEYID,
  secretAccessKey: process.env.AWS_SECRETACCESSKEY,
});
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  signatureVersion: process.env.AWS_SIGNATUREVERSION,
  credentials: awsCred,
});

export default function CreatePasswordScreen({ navigation }) {
  const [password, setPassword] = useState("");
  const { user, setError, regUser } = useContext(AppContext);
  const [loading, setLoading] = useState(false);


  const inputs = [
    {
      name: "password",
      label: "Password",
      placeholderText: "Please enter a password",
      validation: {
        required: { value: true, message: "Password is required" },
        validate: (val) => {
          setPassword(val);
          return validator.isStrongPassword(val) || "Invalid password";
        },
      },
      secureTextEntry: true,
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      placeholderText: "Please confirm your password",
      validation: {
        required: { value: true, message: "Password confirmation is required" },
        validate: (val) => val === password || "Passwords don't match",
      },
      secureTextEntry: true,
    },
  ];

  const handleSubmitPassword = async ({ password, nycheck }) => {
    await setLoading(true)
    if (nycheck == true) {
      // captureScreen({
      //   format: "jpg",
      //   quality: 0.8,
      // }).then(
      //   (uri) => {
      //     ImgToBase64.getBase64String(uri)
      //       .then(base64String => {
      //       })
      //       .catch(err => doSomethingWith(err));

      //   },
      //   (error) => console.error("Oops, snapshot failed", error)
      // );
    }

    // To get dynamic healthix to base64
    try {
      if (regUser?.name) {
        // console.log("NY user")

        var today = new Date();
        var time = today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate() + "T" + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()

        var currentdate = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1) + '-' + (today.getDate() < 10 ? "0" + today.getDate() : today.getDate())

        var userobj = Object.assign(regUser, { "id": user.id, currentdate });

        await HtmlToPDF(userobj).then(async (path) => {

          // To send the base64 data to backend
          RNFetchBlob.fs
            .readFile(path, 'base64')
            .then(async (data) => {
              const arrayBuffer = decode(data);
              var keyPrefix = `HIE/MGH_${user.id}_Healthix_Consent_${time}.pdf`
              await createPassword(user.id, user.email, password);
              try {
                const params = {
                  Key: keyPrefix,
                  Body: arrayBuffer,
                  Bucket: "mg-staging-active-storage-bucket", //process.env.AWS_BUCKET,
                  ACL: "public-read",
                  // ContentEncoding: "utf-8",
                  // ContentType: "binary"
                };
                const uploadData = s3.upload(params, async function (err, data) {
                  if (err) {
                    setLoading(false)
                    console.log('Error', err);
                  } else {
                    await Sendhealthix(user.id, data)
                    await setLoading(false)
                    await navigation.navigate("Beta Feedback");
                  }
                });
              } catch (error) {
                setLoading(false)
                console.log("uploadData error:: ", error)
              }
            })
            .catch((err) => {
              setLoading(false)
            });
        })
      }
      else {
        // console.log("Non NY user")
        const res = await createPassword(user.id, user.email, password);
        setLoading(false)
        navigation.navigate("Beta Feedback");
      }

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      {loading ?
        <View style={styles.loaderDiv}>
          <ActivityIndicator size="large" />
        </View>
        :
        <OnboardingFormTemplate
          getStart
          type="enterDetails"
          inputValues={inputs}
          body={[
            "Welcome! Let's set up your account!",
            "\n",
            "\n",
            `Your username will be ${user.email}`,
          ]}
          header="Please create a password"
          buttonText="Continue"
          handleInput={(data) => {
            handleSubmitPassword(data);
          }}
          extraInfo="Passwords must be at least 8 characters, with at least 1 number, 1 special character, and a mix of uppercase and lowercase letters"
          navigation={navigation}
          subLink="Support"
          showTermsAgreement
        />
      }
    </>

  );
}
const styles = StyleSheet.create({
  loaderDiv: {
    height: "90%",
    alignItems: "center",
    justifyContent: "center"
  }
});