package com.example.Full_Stack_Food_Delivery_App.controller;

import com.example.Full_Stack_Food_Delivery_App.io.CartRequest;
import com.example.Full_Stack_Food_Delivery_App.io.CartResponse;
import com.example.Full_Stack_Food_Delivery_App.service.CartService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;


@RestController
@RequestMapping("/api/cart")
@AllArgsConstructor
public class CartController {

    private final CartService cartService;
    @PostMapping
    public CartResponse addToCart(@RequestBody CartRequest request){
        String foodId = request.getFoodId();
        if(foodId==null || foodId.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "foodId not found");
        }
       return cartService.addTocart(request);
    }

    @GetMapping
    public CartResponse getCart(){

        return cartService.getCart();
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearCart(){
        cartService.clearCart();
    }

    @PostMapping("/remove")
    public CartResponse removeFromCart(@RequestBody CartRequest request){
        String foodId = request.getFoodId();
        if(foodId==null || foodId.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "foodId not found");
        }
        return cartService.removeFromCart(request);
    }

    @PostMapping("/remove/all")
    public CartResponse removeAllFromCart(@RequestBody CartRequest request){
        String foodId = request.getFoodId();
        if(foodId==null || foodId.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "foodId not found");
        }
        return cartService.removeAllFromCart(request);
    }

    @PutMapping("/clear-table")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearTableNo() {
        cartService.clearTableNo();
    }


}
