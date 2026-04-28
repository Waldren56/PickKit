package com.pickit.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "default_unit", nullable = false)
    private String defaultUnit;

    @ElementCollection
    @CollectionTable(name = "category_units", joinColumns = @JoinColumn(name = "category_id"))
    @Column(name = "unit")
    private List<String> availableUnits;

    public Category() {}

    public Category(String name, String defaultUnit, List<String> availableUnits) {
        this.name = name;
        this.defaultUnit = defaultUnit;
        this.availableUnits = availableUnits;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDefaultUnit() { return defaultUnit; }
    public void setDefaultUnit(String defaultUnit) { this.defaultUnit = defaultUnit; }
    public List<String> getAvailableUnits() { return availableUnits; }
    public void setAvailableUnits(List<String> availableUnits) { this.availableUnits = availableUnits; }
}
