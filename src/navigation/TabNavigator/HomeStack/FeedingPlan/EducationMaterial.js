

import React, { useEffect, useContext, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import AppContainer from '../../../../components/AppContainer';
import AppSafeAreaView from '../../../../components/AppSafeAreaView';
import AppLayout from "../../../../components/AppLayout";
import AppText from '../../../../components/AppText';
import AppButton from '../../../../components/AppButton';

import Babyheart from "../../../../../assets/babyheart.png";
import AppHeader from '../../../../components/AppHeader';
import { getBfsArticles, get_mod_articles } from '../../../../api';
import { AppContext } from '../../../../context';
import VitalsTipsArticleViewNew from "../../../../components/VitalsTipsArticleViewNew";
import { useIsFocused } from '@react-navigation/native';
import AppScrollView from '../../../../components/AppScrollView';
export default function EducationMaterial({ navigation }) {
    const isFocused = useIsFocused();

    var info1 = `Thank you for sharing that with us. Here is some additional educational material on infant nutrition.`
    var info2 = `We support you in whatever infant feeding choices you make. If you have any breast concerns or general infant feeding questions you can always connect with an expert on your Mother Goose Care Team page.`;
    const { user } = useContext(AppContext)

    const [articles, setArticles] = useState([])
    const [favArticleIds__, setFavArticleIds] = useState([]);

    const { gestational_age } = user?.pregnancy?.attributes;

    const getFavArticlesIds = async () => {
        setFavArticleIds([])
        const data = await get_mod_articles(user.id, gestational_age)
        if (data?.fav) {
            var arr = []
            await (data?.fav).map((val, key) => {
                arr.push(val.id)
            })
            setFavArticleIds([...arr])
        }
    }
    useEffect(() => {
        async function getArticles() {
            const arti_ = await getBfsArticles(user?.id)
            console.log("getBfsArticles res", arti_)
            if (arti_.length > 0) {
                setArticles(arti_)
            } else {
                setArticles([])
            }
        }
        getArticles()
        getFavArticlesIds()
    }, [user, isFocused])

    return (
        <AppSafeAreaView >
            <AppHeader
                headerTitle="Education Material"
                onBackPress={() => {
                    navigation.goBack();
                    // navigation.goBack(null)
                }}
            />
            <AppLayout onboarding>
                <AppScrollView>

                    <AppContainer transparent >

                        <View style={styles.buttonView}>
                            <Image source={Babyheart} style={{ height: 150, width: 150, resizeMode: "contain", marginTop: 40 }} />
                            <AppText center h2m mt2 blue bold>{info1}</AppText>

                            <VitalsTipsArticleViewNew
                                title={"About Feeding"}
                                bannerImage="Babyheart"
                                navigation={navigation}
                                articles={articles}
                                favArticleIds={favArticleIds__}
                                counterModule={"contraction"}

                            />
                            <AppText center h3 mt1 blue semibold>{info2}</AppText>
                        </View>

                    </AppContainer>
                </AppScrollView>

            </AppLayout>
        </AppSafeAreaView>
    )

}

const styles = StyleSheet.create({
    buttonView: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    }
});