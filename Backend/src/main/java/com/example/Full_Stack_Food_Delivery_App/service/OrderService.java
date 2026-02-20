package com.example.Full_Stack_Food_Delivery_App.service;

import com.example.Full_Stack_Food_Delivery_App.entity.OrderEntity;
import com.example.Full_Stack_Food_Delivery_App.io.OrderRequest;
import com.example.Full_Stack_Food_Delivery_App.io.OrderResponse;

import java.util.List;

public interface OrderService {
//    OrderResponse creatOrderWithPayment(OrderRequest request);
    OrderResponse createOrder(OrderRequest request);
    List<OrderResponse> getAllOrders();
    OrderResponse getOrderById(String orderId);
    List<OrderResponse> getOrdersByUser(String userId);
    void deleteOrder(String id);
    OrderResponse updateOrderStatus(String id, String status);

    List<OrderResponse> getKitchenOrders();
    OrderResponse getLastOrder(String userId);
    List<OrderResponse> getOrdersByTable(int tableNumber);


    List<OrderEntity> payAllOrders(int tableNumber, String paymentMethod);



//    byte[] generateInvoiceFromOrderIds(List<String> orderIds);

    public byte[] generateInvoiceFromOrders(List<String> orderIds);







}
