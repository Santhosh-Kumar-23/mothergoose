import React, { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import _ from "lodash";

import AppSafeAreaView from "../../components/AppSafeAreaView";
import AppLayout from "../../components/AppLayout";
import AppScrollView from "../../components/AppScrollView";
import AppContainer from "../../components/AppContainer";
import AppText from "../../components/AppText";

export default function PrivacyPageScreen({ navigation, route }) {
  const { page, onboarding } = route.params;

  const insets = useSafeAreaInsets();
  useEffect(() => {
    navigation.setOptions({ title: page.title });
  }, [page]);

  return (
    <AppSafeAreaView edges={["left", "right"]}>
      <AppLayout>
        <AppScrollView>
          <AppContainer>
            <AppText
              markdown
              style={onboarding ? { marginBottom: insets.bottom } : {}}
            >
              {_.get(page, "body")}
            </AppText>
          </AppContainer>
        </AppScrollView>
      </AppLayout>
    </AppSafeAreaView>
  );
}
