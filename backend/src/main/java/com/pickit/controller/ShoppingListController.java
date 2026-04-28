package com.pickit.controller;

import com.pickit.model.ShoppingList;
import com.pickit.model.ListItem;
import com.pickit.service.PickitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lists")
public class ShoppingListController {

    private final PickitService service;

    public ShoppingListController(PickitService service) {
        this.service = service;
    }

    @GetMapping
    public List<ShoppingList> getAllLists() {
        return service.getAllLists();
    }

    @GetMapping("/{id}")
    public ShoppingList getList(@PathVariable Long id) {
        return service.getList(id);
    }

    @PostMapping
    public ShoppingList createList(@RequestBody Map<String, String> body) {
        return service.createList(body.get("name"));
    }

    @PutMapping("/{id}")
    public ShoppingList renameList(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return service.renameList(id, body.get("name"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteList(@PathVariable Long id) {
        service.deleteList(id);
        return ResponseEntity.noContent().build();
    }

    // --- Items ---

    @PostMapping("/{listId}/items")
    public ListItem addItem(@PathVariable Long listId, @RequestBody Map<String, Object> body) {
        String productName = (String) body.get("productName");
        int quantity = ((Number) body.get("quantity")).intValue();
        String unit = (String) body.get("unit");
        String categoryName = (String) body.getOrDefault("categoryName", "");
        return service.addItem(listId, productName, quantity, unit, categoryName);
    }

    @PatchMapping("/{listId}/items/{itemId}/toggle")
    public ListItem toggleItem(@PathVariable Long listId, @PathVariable Long itemId) {
        return service.toggleItem(itemId);
    }

    @PatchMapping("/{listId}/items/{itemId}")
    public ListItem updateItem(@PathVariable Long listId,
                               @PathVariable Long itemId,
                               @RequestBody Map<String, Object> updates) {
        return service.updateItem(itemId, updates);
    }

    @DeleteMapping("/{listId}/items/{itemId}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long listId, @PathVariable Long itemId) {
        service.deleteItem(itemId);
        return ResponseEntity.noContent().build();
    }
}
