<template>
    <div>
        <!-- TrustBox widget -->
        <div
            class="trustpilot-widget rightBlock"
            data-locale="en-US"
            data-template-id="539ad60defb9600b94d7df2c"
            data-businessunit-id="51955a2a0000640005300b05"
            data-style-height="700px"
            data-style-width="100%"
            data-stars="4,5"
        >
            <a
                href="https://www.trustpilot.com/review/proofreadingpal.com"
                target="_blank"
                >Trustpilot</a
            >
        </div>
        <!-- End TrustBox widget -->

        <div class="giftAmount rightBlock" style="display:none;">
            <h4>AlphaGraphics Gift Amount</h4>
            <p style="padding-bottom: 5px;">
                You have <span>$7.00</span> in free proofreading and editing
                from ProofreadingPal.
            </p>
            <p style="font-size: 10px;">* Credit expires 12/31/12</p>
        </div>

        <div class="secureRight rightBlock">
            <img
                :src="siteUrl + 'imgs/2015/two-professional-proofreaders.png'"
                alt=""
                style="width:381px;height:172px;"
            />
        </div>

        <div class="weAcceptRight rightBlock">
            <img
                :src="siteUrl + 'imgs/2015/credit_cards.png'"
                alt=""
                style="width:320px;height:75px;"
            />
        </div>

        <div class="guaranteeRight rightBlock">
            <img
                :src="siteUrl + 'imgs/guarantee-100.png'"
                alt=""
                style="width:220px;height:210px;"
            />
        </div>

        <div class="secureRight rightBlock">
            <img
                :src="siteUrl + 'imgs/siteseal_gd_3_h_l_m.gif'"
                alt=""
                style="width:131px;height:32px;vertical-align:middle;"
            />
            <!-- McAfee SECURE Engagement Trustmark for proofreadingpal.com -->
            <div class="trustedsite-trustmark mcafeeRight" style="vertical-align:middle;" data-type="212" data-width="120" data-height="50"></div>
            <!-- End McAfee SECURE Engagement Trustmark for proofreadingpal.com -->
        </div>
    </div>
</template>
