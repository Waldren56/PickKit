package com.pickit.config;

import com.pickit.model.Category;
import com.pickit.model.Product;
import com.pickit.model.ShoppingList;
import com.pickit.repository.CategoryRepository;
import com.pickit.repository.ProductRepository;
import com.pickit.repository.ShoppingListRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(CategoryRepository catRepo,
                               ProductRepository prodRepo,
                               ShoppingListRepository listRepo) {
        return args -> {
            if (catRepo.count() > 0) return; // già caricato

            // Categorie con unità di default
            Category latticini = catRepo.save(new Category("Latticini", "Pezzi",
                    Arrays.asList("Pezzi", "Litri", "Confezioni", "g")));
            Category frutta = catRepo.save(new Category("Frutta", "Kg",
                    Arrays.asList("Kg", "Pezzi", "g")));
            Category verdura = catRepo.save(new Category("Verdura", "Kg",
                    Arrays.asList("Kg", "Pezzi", "g")));
            Category dispensa = catRepo.save(new Category("Dispensa", "Confezioni",
                    Arrays.asList("Confezioni", "Kg", "g")));
            Category panetteria = catRepo.save(new Category("Panetteria", "Pezzi",
                    Arrays.asList("Pezzi", "g", "Kg")));
            Category bevande = catRepo.save(new Category("Bevande", "Litri",
                    Arrays.asList("Litri", "ml", "Bottiglie")));
            Category condimenti = catRepo.save(new Category("Condimenti", "Litri",
                    Arrays.asList("Litri", "ml", "Bottiglie", "g")));
            Category salumi = catRepo.save(new Category("Salumi", "g",
                    Arrays.asList("g", "Confezioni")));
            Category casa = catRepo.save(new Category("Casa", "Confezioni",
                    Arrays.asList("Confezioni", "Pezzi", "Rotoli")));

            // Prodotti
            List<Product> products = Arrays.asList(
                    new Product("Latte", latticini),
                    new Product("Uova", latticini),
                    new Product("Burro", latticini),
                    new Product("Parmigiano", latticini),
                    new Product("Mozzarella", latticini),
                    new Product("Yogurt", latticini),
                    new Product("Mele", frutta),
                    new Product("Banane", frutta),
                    new Product("Arance", frutta),
                    new Product("Pere", frutta),
                    new Product("Fragole", frutta),
                    new Product("Pomodori", verdura),
                    new Product("Zucchini", verdura),
                    new Product("Carote", verdura),
                    new Product("Cipolle", verdura),
                    new Product("Insalata", verdura),
                    new Product("Pasta", dispensa),
                    new Product("Riso", dispensa),
                    new Product("Farina", dispensa),
                    new Product("Zucchero", dispensa),
                    new Product("Tonno", dispensa),
                    new Product("Pelati", dispensa),
                    new Product("Pane", panetteria),
                    new Product("Baguette", panetteria),
                    new Product("Acqua", bevande),
                    new Product("Succo di frutta", bevande),
                    new Product("Caffè", bevande),
                    new Product("Olio d'oliva", condimenti),
                    new Product("Sale", condimenti),
                    new Product("Aceto", condimenti),
                    new Product("Prosciutto", salumi),
                    new Product("Salame", salumi),
                    new Product("Carta igienica", casa),
                    new Product("Detersivo piatti", casa),
                    new Product("Sapone", casa)
            );
            prodRepo.saveAll(products);

            // Due liste di esempio
            listRepo.save(new ShoppingList("Spesa Settimanale"));
            listRepo.save(new ShoppingList("Festa di Compleanno"));

            System.out.println("=== Pickit: catalogo caricato con " + products.size() + " prodotti ===");
        };
    }
}
