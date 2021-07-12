<script>
export default {
    methods: {
        getTurnaroundPrice(turnaround) {
            if (this.SelectedData.numberWords > 0) {
                const smallProjectLimit = parseInt(turnaround.SmallProjectLimit);
                if (
                this.SelectedData.numberWords <= smallProjectLimit 
                && turnaround.SmallProjectAvailable == 'yes'
                ) {
                    return turnaround.SmallProjectPrice;
                } else {
                    return turnaround.Price;
                }
            }
            return false;
        },
        dollarPrice(val, single) {
            if (single) {
                const singleDiscount = this.getSingleDiscount();
                val *= 1 - singleDiscount;
                val = val.toFixed(3);
            }
            return '$' + val;
        },
        centPrice(val, single) {
            if (single) {
                const singleDiscount = this.getSingleDiscount();
                val *= 1 - singleDiscount;
                val = val.toFixed(3);
                val *= 100;
                return val.toFixed(2);
            } else {
                val *= 100;
                return val.toFixed(1);
            }
        },
        pricePerTurnaround(val, single) {
            if (this.SelectedData.numberWords) {
                if (this.SelectedData.numberWords > 0) {
                    if (single && this.singleConditionMet()) {
                        const singleDiscount = this.getSingleDiscount();
                        this.SelectedData.singleDiscount = singleDiscount;
                        val *= 1 - singleDiscount;
                        val = val.toFixed(3);
                    }
                    const price = val * this.SelectedData.numberWords;
                    this.SelectedData.singleDiscount = '';
                    
                    this.bestDealPrice(price);
                    return price.toFixed(2);
                }
            }
            return '';
        },
        getTotalByTurnaround(turnaround, noholiday) {
            let amount = this.pricePerTurnaround(
                this.getTurnaroundPrice(turnaround),
                this.SelectedData.singleOption
            );
            amount = this.checkMinimalAmount(amount);
            amount = parseFloat(amount);
            let total = amount;
            // get other options like surcharges, coupons ...
            const totalOptions = this.getTotalOptions(amount, turnaround, true, noholiday);
            totalOptions.map(function(value) {
                total = value.total;
            });
            total = parseFloat(total);
            return total;
        },
        getTotalOptions(amount, turnaround, upgrade, noholiday) {
            if(!turnaround) {
                turnaround = this.SelectedData.turnaround;
            }
            const totalOptions = [];
            let onsaleUsed = false;
            let total = parseFloat(amount);
            if(!upgrade) {
                this.SelectedData.totalBeforeMinAmount = amount;
            }

            let totalOption = this.getFlatDiscountOption(total, turnaround);
            if (totalOption) {
                totalOptions.push(totalOption);
                total = totalOption.total;
            }

            // file type surcharge

            totalOption = this.getOvernightOption(total, turnaround);
            if (totalOption) {
                totalOptions.push(totalOption);
                total = totalOption.total;
            }

            // 7/5 dollar credit
            totalOption = this.getCreditOption(total);
            if (totalOption) {
                totalOptions.push(totalOption);
                total = totalOption.total;
            }

            totalOption = this.getOnsaleOption(total, turnaround);
            if (totalOption) {
                totalOptions.push(totalOption);
                total = totalOption.total;
                if(totalOption.diff != 0) {
                    onsaleUsed = true;
                }
            }

            totalOption = this.getCouponOption(total, turnaround, onsaleUsed);
            if (totalOption) {
                totalOptions.push(totalOption);
                total = totalOption.total;
            }

            totalOption = this.getDiscountOption(total, turnaround, onsaleUsed);
            if (totalOption) {
                totalOptions.push(totalOption);
                total = totalOption.total;
            }
            if(!upgrade) {
                this.SelectedData.holidayOptions.totalBefore = total;
            }
            if(!noholiday) {
                totalOption = this.getHolidayOption(total);
                if (totalOption) {
                    totalOptions.push(totalOption);
                    total = totalOption.total;
                }
            }

            return totalOptions;
        },
        getFlatDiscountOption(amount, turnaround) {
            if (
                !this.CheckoutData.CustomerCheckoutOptions.FlatOnBoard &&
                turnaround.Name == '2-4_hour'
            ) {
                let total = this.pricePerTurnaround(
                    turnaround.FlatDiscount,
                    this.SelectedData.singleOption
                );
                
                this.SelectedData.totalBeforeMinAmount = total;
                turnaround.Min = parseFloat(turnaround.Min);
                if (total < turnaround.Min) {
                    total = turnaround.Min;
                    this.SelectedData.minAmountUsed = true;
                }
                const diff = amount - total;
                const ret = {};
                ret.amount = diff.toFixed(2);
                ret.sign = '-';
                ret.label = 'Limited-Time Discount';
                ret.total = total;
                return ret;
            }
            return false;
        },
        getOvernightOption(amount, turnaround) {
            if (turnaround.OvernightAllowed) {
                const total = this.percentbasedAmount(
                    parseFloat(turnaround.OvernightPrice),
                    amount,
                    '+'
                );
                const diff = total - amount;
                const ret = {};
                ret.amount = diff.toFixed(2);
                ret.sign = '+';
                ret.label = 'Overnight Surcharge';
                ret.total = total;
                return ret;
            }
            return false;
        },
        getCreditOption(amount) {
            if (this.SelectedData.credit > 0) {
                let credit = this.SelectedData.credit;
                credit = parseFloat(credit);
                credit /= 100;
                const total = amount - credit;
                const ret = {};
                ret.amount = credit.toFixed(2);
                ret.sign = '-';
                ret.label = '$' + credit + ' Credit';
                ret.total = total.toFixed(2);
                return ret;
            }
            return false;
        },
        getOnsaleOption(amount, turnaround) {
            if (
                !turnaround.OvernightAllowed &&
                turnaround.OnsaleActive
            ) {
                let total = this.percentbasedAmount(
                    parseFloat(turnaround.OnsalePercent),
                    amount,
                    '-'
                );

                // check if coupon better saving
                const couponTotal = this.getCouponTotal(amount);
                let message = '';
                if(couponTotal < total) {
                    total = amount;
                    message = 'You save more with the coupon code option.';
                }

                const diff = amount - total;
                const ret = {};
                ret.amount = diff.toFixed(2);
                ret.message = message;
                ret.sign = '-';
                ret.label = turnaround.OnsalePercent + '% On Sale';
                ret.total = total;
                return ret;
            }
            return false;
        },
        getCouponTotal(amount) {
            const ruleAmount = parseFloat(this.SelectedData.couponData.ruleAmount);
            const ruleType = this.SelectedData.couponData.couponRule;
            const total = this.getCouponDicountTotalvalue(ruleAmount, ruleType, amount);
            return total;
        },
        getCouponOption(amount, turnaround, onsaleUsed) {
            if (this.SelectedData.couponData.couponCode) {
                let message = '';
                let total = '';
                if(turnaround.ID == 25 || turnaround.ID == 15) {
                    // if Flat order
                    total = amount;
                    message = 'You coupon can\'t be applied to *FLAT RATE* orders.';
                } else if(!onsaleUsed) {
                    total = this.getCouponTotal(amount);
                } else {
                    total = amount;
                    message = 'You save more with the on sale option.';
                }
                const diff = amount - total;
                const ret = {};
                ret.amount = diff.toFixed(2);
                ret.message = message;
                ret.sign = '-';
                const ruleAmount = parseFloat(this.SelectedData.couponData.ruleAmount);
                const ruleType = this.SelectedData.couponData.couponRule;
                const labelSufix = this.getPercentFixedSufix(ruleAmount,ruleType);
                ret.label = labelSufix + ' Coupon';
                ret.total = total;
                return ret;
            }
            return false;
        },
        getHolidayOption(amount) {
            if(this.SelectedData.holidayOptions) {
                if(this.SelectedData.holidayOptions.surcharge) {
                    const total = parseFloat(amount) + parseFloat(this.SelectedData.holidayOptions.surcharge);
                    const diff = parseFloat(this.SelectedData.holidayOptions.surcharge);
                    const ret = {};
                    ret.amount = diff.toFixed(2);
                    ret.sign = '+';
                    ret.label = 'Holiday Surcharge';
                    ret.total = total.toFixed(2);
                    return ret;
                }
                return false;
            }
            return false;
        },
        getDiscountTotal(amount) {
            if(this.CheckoutData.AccountData) {
                const ruleAmount = parseFloat(this.CheckoutData.AccountData.DiscountAmount);
                const ruleType = this.CheckoutData.AccountData.DiscountType;
                const total = this.getCouponDicountTotalvalue(ruleAmount, ruleType, amount);
                return total;
            }
            return false;
        },
        getDiscountOption(amount, turnaround, onsaleUsed) {
            if(this.CheckoutData.AccountData) {
                if (this.CheckoutData.AccountData.DiscountAvailable) {
                    let message = '';
                    let total = '';
                    if(turnaround.ID == 25 || turnaround.ID == 15) {
                        // if Flat order
                        total = amount;
                        message = 'You discount can\'t be applied to *FLAT RATE* orders.';
                    } else if(!onsaleUsed) {
                        total = this.getDiscountTotal(amount);
                    } else {
                        total = amount;
                        message = 'You save more with the on sale option.';
                    }
                    const diff = amount - total;
                    const ret = {};
                    ret.amount = diff.toFixed(2);
                    ret.message = message;
                    ret.sign = '-';
                    const ruleAmount = parseFloat(this.CheckoutData.AccountData.DiscountAmount);
                    const ruleType = this.CheckoutData.AccountData.DiscountType;
                    const labelSufix = this.getPercentFixedSufix(ruleAmount,ruleType);
                    ret.label = labelSufix + ' Discount';
                    ret.total = total;
                    return ret;
                }
            }
            return false;
        },
        getCouponDicountTotalvalue(ruleAmount, ruleType, amount) {
            let total = '';
            if (ruleType == 'Percent discount' || ruleType == 'Percent Discount') {
                total = this.percentbasedAmount(
                    ruleAmount,
                    amount,
                    '-'
                );
            } else {
                total = amount - ruleAmount;
                total = total.toFixed(2);
            }
            return total;
        },
        getPercentFixedSufix(ruleAmount,ruleType) {
            if(ruleType == 'Percent discount' || ruleType == 'Percent Discount') {
                return ruleAmount+'%';
            }
            return '$'+ruleAmount;
        },
        bestDealPrice(price) {
            if (this.bestDeal == 0) {
                this.bestDeal = price;
                return true;
            } else if (price < this.bestDeal) {
                this.bestDeal = price;
                return true;
            }
            return false;
        },
        percentbasedAmount(percent, price, addSub) {
            percent = parseFloat(percent); 
            let amount = 0;
            if (addSub == '+') {
                amount = price * ((100 + percent) / 100);
            } else {
                amount = price * ((100 - percent) / 100);
            }
            this.bestDealPrice(amount);
            amount = amount.toFixed(2);
            return amount;
        },
        checkMinimalAmount(amount) {
            const minAmount = parseFloat(this.SelectedData.turnaround.Min);
            if (amount < minAmount) {
                this.SelectedData.minAmountUsed = true;
                return minAmount;
            }
            if(this.SelectedData.minAmountUsed == 'flat') {
                this.SelectedData.minAmountUsed = true;
            } else {
                this.SelectedData.minAmountUsed = false;
            }
            return amount;
        },
        getSingleDiscount() {
            if (this.SelectedData.numberWords) {
                const numwords = this.SelectedData.numberWords;
                if (numwords > 15000) {
                    //document.getElementById('singleProofCall').style.display = 'block';
                    return 0.23;
                } else if (numwords > 13500) {
                    return 0.22;
                } else if (numwords > 11500) {
                    return 0.22;
                } else if (numwords > 10000) {
                    return 0.2;
                } else if (numwords > 8500) {
                    return 0.2;
                } else if (numwords > 6500) {
                    return 0.19;
                } else if (numwords > 6000) {
                    return 0.19;
                } else if (numwords > 5500) {
                    return 0.18;
                } else if (numwords > 5000) {
                    return 0.18;
                } else if (numwords > 4500) {
                    return 0.17;
                } else if (numwords > 4000) {
                    return 0.17;
                } else if (numwords > 3500) {
                    return 0.15;
                } else if (numwords > 3000) {
                    return 0.15;
                } else {
                    return 0;
                }
            }
        },
        singleConditionMet() {
            if (this.SelectedData.numberWords) {
                const numwords = this.SelectedData.numberWords;
                if (numwords > 3000) {
                    return true;
                }
            }
            return false;
        }
    }
};
</script>
