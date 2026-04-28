package com.pickit.service;

import com.pickit.model.*;
import com.pickit.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class PickitService {

    private final ShoppingListRepository listRepo;
    private final ListItemRepository itemRepo;
    private final ProductRepository productRepo;

    public PickitService(ShoppingListRepository listRepo,
                         ListItemRepository itemRepo,
                         ProductRepository productRepo) {
        this.listRepo = listRepo;
        this.itemRepo = itemRepo;
        this.productRepo = productRepo;
    }

    // --- Shopping Lists ---

    public List<ShoppingList> getAllLists() {
        return listRepo.findAll();
    }

    public ShoppingList getList(Long id) {
        return listRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Lista non trovata: " + id));
    }

    public ShoppingList createList(String name) {
        return listRepo.save(new ShoppingList(name));
    }

    public ShoppingList renameList(Long id, String newName) {
        ShoppingList list = getList(id);
        list.setName(newName);
        return listRepo.save(list);
    }

    public void deleteList(Long id) {
        listRepo.deleteById(id);
    }

    // --- Items ---

    public ListItem addItem(Long listId, String productName, int quantity, String unit, String categoryName) {
        ShoppingList list = getList(listId);
        ListItem item = new ListItem();
        item.setShoppingList(list);
        item.setProductName(productName);
        item.setQuantity(quantity);
        item.setUnit(unit);
        item.setCategoryName(categoryName);
        item.setDone(false);
        return itemRepo.save(item);
    }

    public ListItem toggleItem(Long itemId) {
        ListItem item = itemRepo.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Prodotto non trovato: " + itemId));
        item.setDone(!item.isDone());
        return itemRepo.save(item);
    }

    public ListItem updateItem(Long itemId, Map<String, Object> updates) {
        ListItem item = itemRepo.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Prodotto non trovato: " + itemId));
        if (updates.containsKey("quantity")) {
            item.setQuantity(((Number) updates.get("quantity")).intValue());
        }
        if (updates.containsKey("unit")) {
            item.setUnit((String) updates.get("unit"));
        }
        if (updates.containsKey("done")) {
            item.setDone((Boolean) updates.get("done"));
        }
        return itemRepo.save(item);
    }

    public void deleteItem(Long itemId) {
        itemRepo.deleteById(itemId);
    }

    // --- Products (catalogo) ---

    public List<Product> searchProducts(String query) {
        if (query == null || query.isBlank()) {
            return productRepo.findAll();
        }
        return productRepo.findByNameContainingIgnoreCase(query);
    }
}
