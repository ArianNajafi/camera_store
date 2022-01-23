const showCart_btn = document.querySelector(".showCart-btn");
const cart = document.querySelector(".cart-modal");
const back_cart = document.querySelector(".backCart");
const confirm_btn = document.querySelector(".confirm-btn");
const products_center = document.querySelector(".products-center");
const cart_numberOfItems =document.querySelector(".cart-items");
const cartContent_inCart = document.querySelector(".cart-content");  //get cartContent

let array_of_reservedProduct = [];      //array of Product in cart

import { arrayOfProducts } from './products.js';


//shop
class Products{
    //get products from products.js
    getProducts(){
        return arrayOfProducts;
    }
}

class ShopUI{
    // show the products on shop
    showProducts(products){
        products.forEach(p => {
            const product = document.createElement("div");
            product.innerHTML = `
                    <div>
                        <img src="${p.img_link}" class="product-img" alt="p-1">
                    </div>
                    <div class="product-info">
                        <p class="product-name">${p.name}</p>
                        <p class="product-price">$${p.price}</p>
                    </div>
                    <div class="addProduct-btn-section">
                        <button class="addProduct-btn">add to cart</button>
                    </div>
            `;
            product.classList = "product";
            product.id = `${p.id}`;
            products_center.appendChild(product);

            //check if product in cart
            array_of_reservedProduct.forEach(p_Cart => {
                if(p_Cart.id == p.id){
                    product.classList.add("inCart");
                    // change text in addBtn
                    product.querySelector(".addProduct-btn").innerHTML = '';
                    product.querySelector(".addProduct-btn").textContent = "in cart";                
                }
            });
        });
    }

    static changeBtn_ifClick_forRemove(id){
        const products = document.querySelectorAll(".product");
        products.forEach(p => {
            if(id == p.id){
            p.querySelector(".addProduct-btn").innerHTML = '';
            p.querySelector(".addProduct-btn").textContent = "add to cart";
            p.classList.remove("inCart");
            }
        });
    }
    static changeBtn_ifClick_forAdd(id){
        const products = document.querySelectorAll(".product");
        products.forEach(p => {
            if(id == p.id){
                p.querySelector(".addProduct-btn").innerHTML = '';
                p.querySelector(".addProduct-btn").textContent = "in cart";
                p.classList.add("inCart");  // for color in css
            }

        });       
    }



}






//Cart:
    // show/hide cart
showCart_btn.addEventListener("click",open_cartModal)
confirm_btn.addEventListener("click",close_cartModal);
back_cart.addEventListener("click",close_cartModal)
function close_cartModal(){
    back_cart.style.display = "none";
    cart.style.opacity = "0";
    cart.style.top = "-100%";
}
function open_cartModal(){
    back_cart.style.display = "block";
    cart.style.opacity = "1";
    cart.style.top = "10%";
}

    //cartUI class
class CartUI{
    // get info and sent to (make(remove)New_product_inCart function) for make(remove) the product in cart
    addRemove_FromCart(e){         
        //get product information
        let product = "";
        let click_addProduct_btn = false;     // this is for check click addBTN 
        if(e.target.classList[0] == "fas"){
            product = e.target.parentElement.parentElement.parentElement;
            click_addProduct_btn = true;
        }
        else if(e.target.classList[0] == "addProduct-btn"){
            product = e.target.parentElement.parentElement;
            click_addProduct_btn = true;
        }
        // baresi in ke mahsol  entekhab shode ast ya darhale laghv ast
        if((click_addProduct_btn === true) && (product.classList[1] !== "inCart")){
            const Name = product.querySelector(".product-info").querySelector(".product-name").textContent;
            const price = Number(product.querySelector(".product-info").querySelector(".product-price").textContent.split("$")[1]);
            const img_link = product.querySelector("div .product-img").src;
            const id = product.id;
            const number = 1;
            
            CartUI.make_newproduct_inCart(id,Name,price,img_link,number);  //send the product info for make in arrayOfPoduct
        }
        else if((click_addProduct_btn === true) && (product.classList[1] === "inCart")){
            const id = product.id;
            CartUI.remove_newproduct_inCart(id);  //send the product info for remove in arrayOfPoduct
        }
    }

    // make the new product in cart
    static make_newproduct_inCart(id,name,price,img_link,number){
        const pr = {id:id, name:name, price:price, img_link:img_link,number:number};
        array_of_reservedProduct.push(pr);    // update array of reserved product
        CartUI.showResult_On_Cart();  //sent for show result
        LocalStorage.saveArrayOf_productInCart(array_of_reservedProduct);  //sent update for localStorage

        //change content of product btn that add
            ShopUI.changeBtn_ifClick_forAdd(id);
    }

    // remove the product in arrayOfCart functions:
    static remove_newproduct_inCart(id){
        array_of_reservedProduct = array_of_reservedProduct.filter(p => (p.id != id));  //update array of reserved Product
        CartUI.showResult_On_Cart();  //sent for show result
        LocalStorage.saveArrayOf_productInCart(array_of_reservedProduct);  //sent update for localStorage

        //change content of product btn that remvoed
        ShopUI.changeBtn_ifClick_forRemove(id);

    }

    // show result of prucudtArray in cart
    static showResult_On_Cart(){
        cartContent_inCart.innerHTML = '';
        array_of_reservedProduct.forEach(p => {
            const newProduct_inCart = document.createElement("div");
            newProduct_inCart.classList = "selected-product";
            newProduct_inCart.id = `${p.id}`;
            newProduct_inCart.innerHTML = `
                <div class="productImg-inCart-div">
                    <img src= ${p.img_link} class="productImg-inCart" alt="img-${p.id}">
                </div>
                <div class="productInfo-inCart">
                    <p class="productName-inCart">${p.name}</p>
                    <p class="productprice-inCart">$${p.price}</p>
                </div>
                <div class="chaneNumber-of-product">
                    <i class="fa-plus-square fas"></i>
                    <p class="number-of-document">${p.number}</p>
                    <i class="fa-minus-square fas"></i>
                </div>
                <i class="fa-trash fas"></i>
            `;
            cartContent_inCart.appendChild(newProduct_inCart);
        });
        //show number of product in cart
        cart_numberOfItems.textContent = array_of_reservedProduct.length;
        this.showTotalPrice();
    }

    // showtotalPrice
    static showTotalPrice(){
        if(array_of_reservedProduct != null){
            const total = array_of_reservedProduct.reduce((total,cur) => {
                return total + (cur.price * cur.number);
            },0);
            cart.querySelector(".total-price").textContent = `total: $${total}`;
        }
        else if(array_of_reservedProduct == null){
            cart.querySelector(".total-price").textContent = `Total:  $${0}`;
        }
    }    


    // Load Data from LocalStorage after refresh(F5)
    static loadDataFrom_LocalStrogae(arrayOfProduct_inLocal){
        arrayOfProduct_inLocal.forEach(p => {
            array_of_reservedProduct.push(p);
        });
        this.showResult_On_Cart();
    }


    //click on cartModal
    static whereClickOn_cartModal(e){
        const whereClick = e.target.classList[0];

        //click on (clear cart)
        if(whereClick === "clearCart-btn"){
            array_of_reservedProduct.forEach(p => {
                CartUI.remove_newproduct_inCart(p.id);
            });
        }

        //click on (trash)
        else if (whereClick === "fa-trash"){
            const id = e.target.parentElement.id;
            CartUI.remove_newproduct_inCart(id);
        }

        //click on (increse the number of product in cart)
        else if(whereClick === ("fa-plus-square")){
            const id = e.target.parentElement.parentElement.id;
            array_of_reservedProduct.forEach(p => {
                if(p.id === id){
                    p.number = p.number + 1;
                    CartUI.showResult_On_Cart();
                }
            });
        }

        // click on (decrese the number of product in cart)
        else if(whereClick === "fa-minus-square"){
            const id = e.target.parentElement.parentElement.id;
            array_of_reservedProduct.forEach(p => {
                if(p.id === id){
                    if(p.number > 1){   // the product in cart cant be lower than 1
                        p.number = p.number - 1;
                        CartUI.showResult_On_Cart();
                    }
                }
            });            
        }

    }

}

    //add or remove product to cart:
const _cartUI = new CartUI;
products_center .addEventListener("click", _cartUI.addRemove_FromCart);  //click on "add cart"

    // remove product from cart/ increase or decreas number of product in cart/ clear all prudct from cart  CLICK:
const clickOnCart = document.querySelector(".cart-modal");
clickOnCart.addEventListener("click",CartUI.whereClickOn_cartModal);
















//Local storage
class LocalStorage{
    //import and export array of reservedProduct
    static saveArrayOf_productInCart(array_of_reservedProduct){
        localStorage.setItem("productInCart",JSON.stringify(array_of_reservedProduct));
    }
    static getArrayOf_productInCart(){
        const getData = localStorage.getItem("productInCart")? JSON.parse( localStorage.getItem("productInCart")): [];
        return getData;
    }

}

document.addEventListener("DOMContentLoaded",() =>{
        //show reserved product on cart
        const cartProduct_inLocalStorage = LocalStorage.getArrayOf_productInCart();
        CartUI.loadDataFrom_LocalStrogae(cartProduct_inLocalStorage);   



    // show product on shop
    const _products = new Products;
    const productsData = _products.getProducts();
    const _shopUI = new ShopUI;
    _shopUI.showProducts(productsData);



});
































