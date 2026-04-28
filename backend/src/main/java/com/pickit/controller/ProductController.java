package com.pickit.controller;

import com.pickit.model.Product;
import com.pickit.service.PickitService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final PickitService service;

    public ProductController(PickitService service) {
        this.service = service;
    }

    @GetMapping
    public List<Product> searchProducts(@RequestParam(required = false) String q) {
        return service.searchProducts(q);
    }
}
