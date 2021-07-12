<template>
<div class="col col-left">
    <div class="loader">
        <div class="loadingio-spinner-ripple-ngkuh2bdgmk">
            <div class="ldio-x8miegud26"><div></div><div></div></div>
        </div>
    </div>
</div>
</template>

<style scoped>
    .loader{
        width: 100%;
        text-align: center;
        margin: 50px 0;
    }
    @keyframes ldio-x8miegud26 {
    0% {
        top: 96px;
        left: 96px;
        width: 0;
        height: 0;
        opacity: 1;
    }
    100% {
        top: 18px;
        left: 18px;
        width: 156px;
        height: 156px;
        opacity: 0;
    }
    }

    .ldio-x8miegud26 div {
    position: absolute;
    border-width: 4px;
    border-style: solid;
    opacity: 1;
    border-radius: 50%;
    animation: ldio-x8miegud26 1s cubic-bezier(0,0.2,0.8,1) infinite;
    }

    .ldio-x8miegud26 div:nth-child(1) {
    border-color: #3c82b5
    }

    .ldio-x8miegud26 div:nth-child(2) {
    border-color: #28a0f8;
    animation-delay: -0.5s;
    }

    .loadingio-spinner-ripple-ngkuh2bdgmk {
    width: 200px;
    height: 200px;
    margin: 0 auto;
    display: inline-block;
    overflow: hidden;
    /*background: #f1f2f3;*/
    }
    .ldio-x8miegud26 {
    width: 100%;
    height: 100%;
    position: relative;
    transform: translateZ(0) scale(1);
    backface-visibility: hidden;
    transform-origin: 0 0; /* see note above */
    }
    .ldio-x8miegud26 div { box-sizing: content-box; }
</style>