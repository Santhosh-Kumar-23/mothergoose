import RNHTMLtoPDF from 'react-native-html-to-pdf';
const healthixLogo = process.env.HEALTHIXLOGO;
export const HtmlToPDF = async (regUser) => {

    const HTMLDATA2 = await `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        /* Font Definitions */
        body {
            width: 685px;
            margin: auto;
            background: #FFF;
            padding: 20px 70px;
        }

        @font-face {
            font-family: "Cambria Math";
            panose-1: 2 4 5 3 5 4 6 3 2 4;
        }

        @font-face {
            font-family: Georgia;
            panose-1: 2 4 5 2 5 4 5 2 3 3;
        }

        @font-face {
            font-family: "Noto Sans Symbols";
        }

        /* Style Definitions */
        p.MsoNormal,
        li.MsoNormal,
        div.MsoNormal {
            margin: 0in;
            text-autospace: none;
            font-size: 11.0pt;
            font-family: "Arial", sans-serif;
        }

        p.MsoTitle,
        li.MsoTitle,
        div.MsoTitle {
            mso-style-link: "Title Char";
            margin-top: 5.55pt;
            margin-right: 11.9pt;
            margin-bottom: 0in;
            margin-left: 0in;
            text-align: right;
            text-autospace: none;
            font-size: 11.0pt;
            font-family: "Arial", sans-serif;
            font-weight: bold;
        }

        span.TitleChar {
            mso-style-name: "Title Char";
            mso-style-link: Title;
            font-family: "Arial", sans-serif;
            font-weight: bold;
        }

        .MsoChpDefault {
            font-family: "Arial", sans-serif;
        }

        /* Page Definitions */
        @page WordSection1 {
            size: 8.5in 11.0in;
            margin: 75.0pt 42.0pt 37.0pt 47.0pt;
        }

        div.WordSection1 {
            page: WordSection1;
        }

        @page WordSection2 {
            size: 8.5in 11.0in;
            margin: 75.0pt 42.0pt 37.0pt 47.0pt;
        }

        div.WordSection2 {
            page: WordSection2;
        }

        @page WordSection3 {
            size: 8.5in 11.0in;
            margin: 75.0pt 42.0pt 37.0pt 47.0pt;
        }

        div.WordSection3 {
            page: WordSection3;
        }



        #border_sec {
            padding-top: 5px;
            padding-bottom: 15px;
            border-bottom: 3px solid black;
        }

        table {
            width: 100%;
            margin-left: 0 !important;
        }

       

        td {
            height: 36pt !important;
        }
    </style>


</head>

<body>
    <!-- <div class="main"> -->

    <div class="logo"><img width=150 height=40 src=${healthixLogo} alt="Healthix"></div>
    <div class=WordSection1>

        <p class=MsoTitle style="margin-right: 0;">Authorization for Access to Patient Information</p>

        <p class=MsoNormal id="border_sec" align=right><span style='font-size:9.0pt;float: left;'>New York State
                Department of Health                                </span><b>Through
                a Health Information Exchange Organization</b>

            <!-- <table cellpadding=0 cellspacing=0>
                <tr>
                    <td width=9 height=0></td>
                </tr>
                <tr>
                    <td></td>
                    <td><img width=674 height=4
                            src="healthix%20conset%20for%20registration%20section%20at%20beginning%20of%20mobile%20app_files/image001.png">
                    </td>
                </tr>
            </table> -->

            <br clear=ALL>
        </p>

        <p class=MsoNormal style='margin-top:.3pt;border:none'><b><span
                    style='font-size:10.0pt;color:black'>&nbsp;</span></b></p>

        <table class=2 border=1 cellspacing=0 cellpadding=0 width=652 style='margin-left:
 7.25pt;border-collapse:collapse;border:none'>
            <tr style='height:27.55pt'>
                <td width=318 valign=top style='width:238.55pt;border:solid black 1.0pt;
  padding:0in 0in 0in 0in;height:42.55pt;padding: 8px 0;'>
                    <p class=MsoNormal style='margin-left:5.35pt;line-height:76%;border:none;'><span
                            style='font-size:8.0pt;line-height:76%;color:black;'>Patient
                            Name</span></p>
                            <p class=MsoNormal style='margin-left:5.35pt;line-height:76%;border:none;padding-top: 20px;'>
                            <span style='font-size:8.0pt;line-height:76%;color:black;'>
                                ${regUser?.name}</span>
                        </p>
                </td>
                <td width=138 valign=top style='width:103.45pt;border:solid black 1.0pt;
  border-left:none;padding:0in 0in 0in 0in;height:27.55pt;padding: 8px 0;'>
                    <p class=MsoNormal style='margin-left:5.2pt;line-height:76%;border:none'><span
                            style='font-size:8.0pt;line-height:76%;color:black;'>Date of
                            Birth</span></p>
                    <p class=MsoNormal style='margin-left:5.2pt;line-height:76%;border:none;padding-top: 20px;'>
                        <span style='font-size:8.0pt;line-height:76%;color:black;'>${regUser?.dob}</span>
                    </p>
                </td>
                <td width=196 valign=top style='width:147.35pt;border:solid black 1.0pt;
  border-left:none;padding:0in 0in 0in 0in;height:27.55pt;padding: 8px 0;'>
                    <p class=MsoNormal style='margin-left:5.35pt;line-height:76%;border:none'><span
                            style='font-size:8.0pt;line-height:76%;color:black;'>Patient
                            Identification Number</span></p>
                    <p class=MsoNormal style='margin-left:5.35pt;line-height:76%;border:none'><span
                            style='font-size:8.0pt;line-height:76%;color:black;'>(this
                            will be the MGH EDW unique ID)</span></p>
                    <p class=MsoNormal style='margin-left:5.35pt;line-height:76%;border:none;padding-top: 10px;'>
                        <span style='font-size:8.0pt;line-height:76%;color:black;'>${regUser?.id}
                        </span>
                    </p>
                </td>
            </tr>
            <tr style='height:38.9pt'>
                <td width=652 colspan=3 valign=top style='width:489.35pt;border:solid black 1.0pt;
  border-top:none;padding:0in 0in 0in 0in;height:45.9pt;padding: 8px 0;'>
                    <p class=MsoNormal style='margin-left:5.35pt;line-height:76%;border:none'><span
                            style='font-size:8.0pt;line-height:76%;color:black;'>Patient
                            Address</span></p>
                    <p class=MsoNormal style='margin-left:5.35pt;line-height:76%;border:none;padding-top:7px;'>
                        <span style='font-size:8.0pt;line-height:76%;color:black;'>${regUser?.address}
                        </span>
                    </p>
                </td>
            </tr>
        </table>



        <div class=WordSection2 style="padding-top:15px;text-align: justify;">

            <p class=MsoNormal><span style='font-size:10.0pt;'>I
                    request that health information regarding my care and treatment be accessed as
                    set forth on this form. I can choose
                    whether or not to allow the health information exchange organization called
                    Healthix. If I give consent, my medical records from different places where I
                    get health care can be accessed using a statewide computer network. Healthix is
                    a not-for-profit organization that shares information about people’s health
                    electronically to improve the quality of healthcare and meets the privacy and
                    security standards of HIPAA, the requirements of the federal confidentiality
                    laws, 42 CFR Part2, and New York State Law. To learn more visit Healthix’s
                    website at </span><a href="http://www.healthix.org/"><span style='font-size:
10.0pt;color:windowtext;text-decoration:none'>www.healthix.org.</span></a></p>

            <p class=MsoNormal style='margin-top:.2pt;border:none'><span style='font-size:
9.5pt;color:black'>&nbsp;</span></p>

            <p class=MsoNormal style='margin-top:.05pt;margin-bottom:
.3pt;text-align:justify;padding-bottom: 5px;'><b><span style='font-size:10.0pt;font-weight: 600;'>The
                        choice I make in this form will NOT affect my ability to get medical care. The
                        choice I make in this form does NOT allow health insurers to have access to my
                        information for the purpose of deciding whether to provide me with health
                        insurance coverage or pay my medical bills.</span></b>
              
            </p>

            <table class=1 border=1 cellspacing=0 cellpadding=0 width=654 style='margin-left:
 6.05pt;border-collapse:collapse;border:none'>
                <tr style='height:41.25pt'>
                    <td width=654 valign=top style='width:490.55pt;border:solid black 1.0pt;
  background:#F2F2F2;padding:0in 0in 0in 0in;height:41.25pt;padding: 10px 0;'>
                        <p class=MsoNormal style='margin-left:13.25pt;line-height:111%;border:none'><b><span
                                    style='font-size:12.0pt;line-height:111%;color:black'>My Consent
                                    Choice</span></b><span style='font-size:12.0pt;line-height:111%;color:black'>.
                                ONE
                                box is checked to
                                the left of my choice.</span></p>
                        <p class=MsoNormal style='margin-top:.1pt;margin-right:0in;margin-bottom:
  0in;margin-left:31.5pt;margin-bottom:.0001pt;border:none'><span style='font-size:12.0pt;color:black'>I can fill out
                                this form now or in the
                                future.</span></p>
                        <p class=MsoNormal style='margin-top:.15pt;margin-right:0in;margin-bottom:
  0in;margin-left:31.5pt;margin-bottom:.0001pt;line-height:107%;border:none'><span
                                style='font-size:12.0pt;line-height:107%;color:black'>I can also change my
                                decision at any time by completing a new form.</span></p>
                    </td>
                </tr>
                <tr style='height:42.9pt'>
                    <td width=654 valign=top style='width:490.55pt;border:solid black 1.0pt;
  border-top:none;padding:0in 0in 0in 0in;height:42.9pt'>
                        <p class=MsoNormal style='margin-top:7.35pt;margin-right:;margin-bottom:
  0in;margin-left:31.5pt;margin-bottom:.0001pt;text-indent:-.25in;border:none'><span
                                style='font-size:10.0pt;font-family:"Noto Sans Symbols"'>X</span><span
                                style='font-size:10.0pt;font-family:"Times New Roman",serif;color:black'>
                            </span><b><span style='font-size:10.0pt;color:black'>1. I GIVE CONSENT </span></b><span
                                style='font-size:10.0pt;color:black'>for </span><span style='font-size:12.0pt;
  color:black'>Mother Goose Health </span><span style='font-size:10.0pt;
  color:black'>to access ALL of my electronic health information through
                                Healthix to provide health care.</span></p>
                    </td>
                </tr>
                <tr style='height:44.35pt'>
                    <td width=654 valign=top style='width:490.55pt;border:solid black 1.0pt;
  border-top:none;padding:0in 0in 0in 0in;height:44.35pt'>
                        <p class=MsoNormal style='border:none'><b><span style='font-size:10.0pt;
  color:black'>&nbsp;</span></b></p>
                        <p class=MsoNormal style='margin-left:34.2pt;text-indent:-20.75pt;line-height:
  88%;border:none'><span style='font-size:10.0pt;line-height:88%;font-family:
  "Noto Sans Symbols";color:black'>□</span><span style='font-size:10.0pt;
  line-height:88%;font-family:"Times New Roman",serif;color:black'> </span><b><span
                                    style='font-size:10.0pt;line-height:88%;color:black'>2. I DENY CONSENT
                                </span></b><span style='font-size:10.0pt;line-height:88%;color:black'>for
                            </span><span style='font-size:12.0pt;line-height:88%;color:black;'>Mother
                                Goose Health t</span><span style='font-size:10.0pt;line-height:88%;
  color:black'>o access my electronic health information through Healthix for
                                any purpose.</span></p>
                    </td>
                </tr>
            </table>

            <p class=MsoNormal style='margin-top:8.9pt;margin-bottom:
0in;margin-bottom:.0001pt;text-align:justify'><span style='font-size:10.0pt'>If I want to deny
                    consent for all Provider
                    Organizations and Health Plans participating in Healthix to access my
                    electronic health information through Healthix, I may do so by visiting
                    Healthix’s website at </span><a href="http://www.healthix.org/"><span
                        style='font-size:10.0pt;color:windowtext;text-decoration:none'>www.healthix.org
                    </span></a><span style='font-size:10.0pt'>or calling Healthix at 877-695-4749.</span></p>

            <p class=MsoNormal style='margin-top:.1pt;border:none'><span style='font-size:
10.0pt;color:black'>&nbsp;</span></p>

            <p class=MsoNormal style='text-align:justify'><span style='font-size:10.0pt'>My
                    questions
                    about this form have been answered and I
                    have been provided a copy of this form in the Legal section of the Mother Goose
                    Health mobile application.</span></p>
<!-- 
            <p class=MsoNormal style='margin-left:6.95pt;text-align:justify'><span
                    style='font-size:10.0pt'>&nbsp;</span>
            </p>

            <p class=MsoNormal style='text-align:justify'><span style='font-size:10.0pt'>&nbsp;</span></p> -->

            <p class=MsoNormal style='text-align:justify'><span style='font-size:10.0pt'>&nbsp;</span></p>

            <p class=MsoNormal><span style='font-size:12.0pt'>&nbsp;</span></p>

            <p class=MsoNormal><span style='font-size:12.0pt'>Signature of Patient: <span style=''>${regUser?.name}</span></span></p>

            <p class=MsoNormal><span style='font-size:12.0pt'>&nbsp;</span></p>

            <p class=MsoNormal><span style='font-size:12.0pt'>Date:  <span style=''>${regUser?.currentdate}</span></span></p>

        </div>

</body>

</html>`

    var createAt = new Date();

    let options = {
        html: HTMLDATA2,
        fileName: 'healthix-' + createAt,
        directory: 'Documents',
    };

    let file = await RNHTMLtoPDF.convert(options)
    // console.log("healthix file path", file.filePath);

    return file.filePath
}