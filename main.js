let eventBus = new Vue({})
Vue.component('product', {
    props: {
        trending: {
            type: Boolean,
            required: false
        }
    },
    template: `
    <div class="mainCont container-fluid">
    <div class="productDiv">
        <div class="productImage">
            <img :src="image">
        </div>
        <div class="productInfo container-fluid">
                <h1>{{title}}</h1>
                <h5>Four pack of men's socks. Avalible in five different colors and three different sizes!</h5>

            <div class="randomShit">
                <ul class="prodGeneralDetails">
                <li v-for="details in productDetails">{{details}}</li>
                </ul>
                <br>
                <ul class="prodSizeDetails">
                <li class="sizeDetails" v-for="sizeDetail in sizeDetails">{{sizeDetail}}</li>
                </ul>
            </div>

                    <div class="colorCont">
                            <div class="color-info container-fixed" 
                                v-for="(variant, index) in variants" 
                                :key="variant.variantId"
                                :style="{backgroundColor : variant.variantColor}"
                                v-on:click="updateProduct(index)">
                            </div>
                    </div>
            </div>
            <div class="cartCont container-fixed">
                    <div class="salesPrice">
                    <h5>Total</h5>

                        <p class="saleNumbers">$ {{itemTotal}}</p>
                        <h6>Free Shipping and Returns</h6>
                    </div>
                                <div class="saleItems">
                                        <span class="stockAndQuantity">
                                        <p v-if="inStock > 5">In Stock</p>
                                        <p v-else-if="5 >= inStock && inStock > 1">Almost Out</p>
                                        <p v-else="inStock === 0">Out of Stock</p>
                                        <p v-if="inStock> 0">Quantity : {{inStock}}</p>
                                        <p v-else="inStock">Quantity : 0</p>

                                        <p v-if="itemTrending">Popularity: <i class="fas fa-fire"></i></p>
                                        <p v-else="!itemTrending">Popularity: <i class="fas fa-snowflake"></i></p>
                                        <p>Shipping: {{shipping}}</p>
                                        </span>
                                </div>
                            <div class="deliveryInfo">
                                <h5>Seller Info</h5>
                                <p>Name : </p>
                                <p>Address : </p>
                                <p>City : </p>
                                <p>Rating : </p>
                                <p>ETA : </p>
                            </div>
                            <div class="btnCont container-fixed">
                                <button v-on:click="addToCart"
                                class="cartButton"
                                :disabled="inStock == 0"
                                :class="{ disabledButton : !inStock }">Add to Cart</button>
                                <button v-on:click="removeCartFunc" class="removeCartBtn">
                                <i class="fas fa-trash"></i>
                                </button>
                            </div>
                </div>
        </div>
            <div class="tabBar">
                <product-tabs :reviews="reviews"></product-tabs>
            </div>
        </div>
    `,
    data() {
        return {
            product: 'Socks',
            selectedVariant: 0,
            productDetails: ["80% Cotton", "20% Polyester", "Stylish", "2 Pack"],
            sizeDetails: ["1 Size", "Unisex", "Custom Size Avail", "Random"],
            variants: [
                {
                    variantId: 4379,
                    variantColor: "Blue",
                    variantImage: "./blue-sock.jpg",
                    variantQuantity: 25,
                    variantPrice: "6.99",
                    variantTrending: false
                },
                {
                    variantId: 4381,
                    variantColor: "White",
                    variantImage: "./white-sock.jpg",
                    variantQuantity: 4,
                    variantPrice: "9.99",
                    variantTrending: true
                },
                {
                    variantId: 4380,
                    variantColor: "Green",
                    variantImage: "./green-sock.jpg",
                    variantQuantity: 0,
                    variantPrice: "6.99",
                    variantTrending: false
                }
            ],
            brand: "Vue Mastery",
            reviews: []
        }
    },
    methods: {
        addToCart: function () {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
            console.log(this.variants[this.selectedVariant].variantId)
        },
        updateProduct: function (index) {
            this.selectedVariant = index
        },
        removeCartFunc: function () {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
        }
    },
    computed: {
        title() {
            return this.brand + " " + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        itemPrice() {
            return this.variants[this.selectedVariant].variantPrice
        },
        itemTrending() {
            return this.variants[this.selectedVariant].variantTrending
        },
        shipping() {
            if (this.premiumAccount) {
                return "Free"
            } else {
                return 2.99
            }
        },
        itemTotal() {
            let price = parseInt(this.variants[this.selectedVariant].variantPrice)
            let shippingCost = this.shipping
            return price + shippingCost
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
})

Vue.component('product-review', {
    template:
        `
    <div class="createReviewDiv container-fixed">
        <form class="reviewForm" @submit.prevent="onSubmit">
            <label for="name">Name</label>
                <input v-model="name">
            <label for="review">Review</label>
                <textarea v-model="review" id="review"></textarea>
        <p>
            <label for="rating">Rating</label>
                <select id="rating" v-model.number="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
        </p>
        <button class="submitReviewBtn">Submit</button>
    </form>
</div>
`,
    data() {
        return {
            name: null,
            review: null,
            rating: null
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
            } else {
                if (!this.name) {
                    alert("Please Fill Out Your Name")
                } else if (!this.review) {
                    alert("Please Fill Out Your Review")
                } else if (!this.rating) {
                    alert("Please Fill Out Your Rating")
                }
            }
        }
    }
})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: true
        }
    },
    template:
        `
        <div class="tabsMainCont container-fixed">
                <div class="reviewAndRelatedCont container-fixed">
                    <div class="tab"
                        :class="{activeTab : selectedTab === tab}"
                            v-for="(tab , index) in tabs" 
                            :key="index"
                            @click="selectedTab = tab">
                        {{ tab }}
                        </div>
                        <div class="emptyReviewText" v-show="selectedTab === 'Reviews'">
                        <h2>Reviews</h2>
                            <ul>
                                <h4 v-if="!reviews.length">Uh Oh.. looks like this product doesn't have any reviews yet. Check back later or create a free account and be the first to share your thoughts!</h4>
                                    <li v-else="reviews.length" v-for="review in reviews">
                                        <p>Name : {{review.name}}</p>
                                        <p>Rating : {{review.rating}}</p>
                                        <p>Review : {{review.review}}</p>
                                    </li>
                            </ul>
                    </div>
                    <product-review v-show="selectedTab === 'Make a Review'"></product-review>
                </div>
                        <div class="doSomething container-fixed">
                            <h4>Related Items</h4>
                            <span>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </span>
                        </div>
            </div>
        `,
    data() {
        return {
            tabs: ["Reviews", "Make a Review"],
            selectedTab: 'Reviews'
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        premiumAccount: true,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        },
        removeCart(id) {
            const index = this.cart.indexOf(id);
            if (index > -1) {
                this.cart.splice(index, 1);
            }
        }
    }
})