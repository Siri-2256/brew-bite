import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ShoppingBag, Menu, X, Search, Moon, Sun, 
  Coffee, ChevronRight, Plus, Minus, Trash2, Star, 
  ArrowUpDown, CheckCircle2, Loader2, Heart, Clock, 
  Tag, Flame, Package, Truck, Utensils, MessageSquare, 
  ArrowRight, Bell, Lock, MapPin, History, RefreshCcw,
  CreditCard, Trophy
} from 'lucide-react';

// ==========================================
// 1. DATA HELPERS
// ==========================================
const r10 = (n) => Math.round(n / 10) * 10; 

const getItemRating = (id) => ({ rating: (4.0 + (id % 10) / 10).toFixed(1), reviews: 40 + (id * 13) % 250 });
const isItemPopular = (id) => id % 4 === 0;

const vCoffee = (p) => [
  { name: 'Short', desc: `250ml`, price: p },
  { name: 'Tall', desc: `350ml`, price: p + 50 },
  { name: 'Venti', desc: `600ml`, price: p + 100 }
];

const vEspresso = (p) => [
  { name: 'Single', desc: '30ml', price: p },
  { name: 'Double', desc: '60ml', price: p + 50 },
  { name: 'Triple', desc: '90ml', price: p + 100 }
];

const vFood = (p) => [
  { name: '1 Piece', desc: 'Standard', price: p },
  { name: '2 Pieces', desc: 'Double', price: r10(p * 1.8) },
  { name: 'Full Box', desc: 'Pack of 6', price: r10(p * 3.5) }
];

const vSides = (p) => [
  { name: 'Regular', desc: 'Standard', price: p },
  { name: 'Medium', desc: 'To share', price: r10(p * 1.5) },
  { name: 'Large', desc: 'Family size', price: r10(p * 2) }
];

const vMeal = (p) => [
  { name: 'Single', desc: 'A la carte', price: p },
  { name: 'Double Pack', desc: 'For two', price: r10(p * 1.8) },
  { name: 'Full Meal', desc: 'With sides', price: r10(p * 2.5) }
];

const vPizza = (p) => [
  { name: 'Personal', desc: '7 inch', price: p },
  { name: 'Medium', desc: '10 inch', price: r10(p * 1.8) },
  { name: 'Large', desc: '14 inch', price: r10(p * 2.5) }
];

const vCake = (p) => [
  { name: '1 Slice', desc: 'Standard', price: p },
  { name: '2 Slices', desc: 'Double', price: r10(p * 1.8) },
  { name: 'Full Cake', desc: '1 Kg', price: r10(p * 6) }
];

const vIceCream = (p) => [
  { name: '1 Scoop', desc: 'Standard', price: p },
  { name: '2 Scoops', desc: 'Double', price: r10(p * 1.8) },
  { name: 'Full Tub', desc: '500ml', price: r10(p * 3.5) }
];

// ==========================================
// 2. MASTER DATA ARRAY 
// ==========================================
const CATEGORIES = ['All', 'Coffee', 'Smoothies & Shakes', 'Bakery', 'Fast Food', 'Desserts'];

const UNIQUE_ITEM_DATA = {
  1: { desc: "Espresso is a small, strong shot of coffee made by pushing hot water through finely ground coffee beans.", ing: ["Finely Ground Coffee Beans", "Hot Filtered Water"], prep: ["Standard", "Ristretto", "Lungo"] },
  2: { desc: "Cappuccino is a balanced coffee made with espresso, steamed milk, and a thick layer of foam.", ing: ["Espresso", "Steamed Milk", "Milk Foam"], prep: ["Standard", "Extra Foam", "Less Foam"] },
  3: { desc: "Latte is a smooth and mild coffee made with espresso and a larger amount of steamed milk.", ing: ["Espresso", "Steamed Milk"], prep: ["Standard", "Extra Hot", "Warm"] },
  4: { desc: "Cold brew is coffee brewed slowly in cold water for several hours.", ing: ["Coarse Coffee Grounds", "Cold Water", "Ice"], prep: ["Standard", "Less Ice", "No Ice"] },
  5: { desc: "Mocha is a coffee drink that combines espresso, chocolate, and milk.", ing: ["Espresso", "Chocolate Syrup", "Milk"], prep: ["Standard", "Extra Chocolate", "With Whipped Cream"] },
  6: { desc: "Americano is made by adding hot water to espresso.", ing: ["Espresso", "Hot Water"], prep: ["Standard", "Stronger", "Milder"] },
  7: { desc: "Iced coffee is brewed coffee served cold with ice.", ing: ["Brewed Coffee", "Ice"], prep: ["Standard", "Extra Ice", "Less Ice"] },
  8: { desc: "Flat white is a creamy coffee made with espresso and finely textured milk.", ing: ["Double Espresso", "Steamed Milk"], prep: ["Standard", "Extra Hot"] },
  9: { desc: "Caramel latte is a sweet coffee made with espresso, milk, and caramel syrup.", ing: ["Espresso", "Milk", "Caramel Syrup"], prep: ["Standard", "Extra Caramel", "Less Sweet"] },
  10: { desc: "Vanilla latte is a mild coffee with espresso, milk, and vanilla syrup.", ing: ["Espresso", "Milk", "Vanilla Syrup"], prep: ["Standard", "Extra Vanilla", "Less Sweet"] },
  11: { desc: "Croissant is a flaky, buttery pastry with a crisp outer layer and soft inside.", ing: ["Flour", "Butter", "Yeast"], prep: ["Warm", "Room Temperature"] },
  12: { desc: "Muffins are soft and fluffy baked cakes, often filled with fruits like blueberries.", ing: ["Flour", "Blueberries", "Eggs", "Butter"], prep: ["Warm", "Room Temperature"] },
  13: { desc: "Cookies are baked treats that are crispy on the outside and soft inside.", ing: ["Flour", "Chocolate Chips", "Sugar"], prep: ["Warm", "Room Temperature"] },
  14: { desc: "Brownies are rich chocolate desserts with a soft and slightly fudgy texture.", ing: ["Cocoa", "Chocolate", "Flour", "Eggs"], prep: ["Warm", "With Ice Cream"] },
  15: { desc: "Veg sandwich is made with fresh vegetables, bread, and sauces.", ing: ["Bread", "Vegetables", "Sauce"], prep: ["Grilled", "Toasted", "Plain"] },
  16: { desc: "Veg cheese sandwich is a vegetable sandwich with melted cheese added.", ing: ["Bread", "Vegetables", "Cheese"], prep: ["Grilled", "Extra Cheese"] },
  17: { desc: "Garlic bread is made by baking bread with garlic butter and herbs.", ing: ["Bread", "Garlic Butter", "Herbs"], prep: ["Crispy", "Cheese Added"] },
  18: { desc: "Chicken pizza is made with a baked base topped with chicken, cheese, and sauce.", ing: ["Pizza Base", "Chicken", "Cheese", "Sauce"], prep: ["Thin Crust", "Thick Crust"] },
  19: { desc: "Veg burger contains a vegetable patty, fresh vegetables, and sauces inside a soft bun.", ing: ["Burger Bun", "Veg Patty", "Vegetables"], prep: ["Grilled", "Crispy"] },
  20: { desc: "Chicken burger is made with a chicken patty, lettuce, and sauces inside a bun.", ing: ["Burger Bun", "Chicken Patty", "Sauce"], prep: ["Grilled", "Crispy"] },
  21: { desc: "French fries are thin potato strips fried until crispy and lightly salted.", ing: ["Potatoes", "Oil", "Salt"], prep: ["Normal", "Extra Crispy", "Spicy"] },
  22: { desc: "Veg pizza is a cheesy pizza topped with vegetables.", ing: ["Pizza Base", "Cheese", "Vegetables"], prep: ["Thin Crust", "Thick Crust"] },
  23: { desc: "Chicken wrap is a soft flatbread filled with chicken and vegetables.", ing: ["Wrap", "Chicken", "Vegetables"], prep: ["Grilled", "Light Toast"] },
  24: { desc: "Cheesecake is a soft and creamy dessert made from cream cheese on a biscuit base.", ing: ["Cream Cheese", "Biscuit Base", "Sugar"], prep: ["Chilled"] },
  25: { desc: "Chocolate cake is a soft and moist cake made with chocolate and layered with frosting.", ing: ["Flour", "Chocolate", "Eggs", "Butter"], prep: ["Chilled", "Warm"] },
  26: { desc: "Vanilla ice cream is a smooth frozen dessert made with milk, cream, and vanilla flavor.", ing: ["Milk", "Cream", "Vanilla"], prep: ["Cup", "Cone"] },
  27: { desc: "Chocolate ice cream is a creamy frozen dessert made with chocolate flavor.", ing: ["Milk", "Chocolate", "Cream"], prep: ["Cup", "Cone"] },
  28: { desc: "Strawberry ice cream is a sweet frozen dessert made with strawberry flavor.", ing: ["Milk", "Strawberry", "Cream"], prep: ["Cup", "Cone"] },
  29: { desc: "Waffles are crispy on the outside and soft inside, often served with chocolate or syrup.", ing: ["Flour", "Butter", "Eggs"], prep: ["Extra Crispy", "Chocolate Topping"] },
  30: { desc: "Donuts are soft, fried dough rings with a sweet glaze or topping.", ing: ["Flour", "Sugar", "Yeast"], prep: ["Warm"] },
  31: { desc: "Brownie sundae is a dessert made with warm brownie topped with cold ice cream.", ing: ["Brownie", "Ice Cream", "Chocolate Sauce"], prep: ["Standard"] },
  32: { desc: "Tiramisu is an Italian dessert made with coffee-soaked cake layers and creamy cheese.", ing: ["Coffee", "Cream", "Cake"], prep: ["Chilled"] },
  33: { desc: "Fruit tart is a pastry filled with cream and topped with fresh fruits.", ing: ["Pastry", "Cream", "Fruits"], prep: ["Chilled"] },
  34: { desc: "Macchiato is an espresso with a small amount of milk foam added on top.", ing: ["Espresso", "Milk Foam"], prep: ["Standard"] },
  35: { desc: "Cortado is made with equal parts espresso and milk.", ing: ["Espresso", "Milk"], prep: ["Standard", "Extra Hot"] },
  36: { desc: "Drip coffee is made by slowly filtering hot water through ground coffee.", ing: ["Ground Coffee", "Hot Water"], prep: ["Standard", "Strong"] },
  37: { desc: "French press coffee is made by steeping coffee grounds directly in hot water.", ing: ["Coffee Grounds", "Hot Water"], prep: ["Standard"] },
  38: { desc: "Affogato is a dessert made by pouring hot espresso over a scoop of ice cream.", ing: ["Espresso", "Ice Cream"], prep: ["Standard"] },
  39: { desc: "Irish coffee is a hot drink made with coffee, sugar, cream, and whiskey.", ing: ["Coffee", "Sugar", "Cream", "Whiskey"], prep: ["Standard", "Extra Cream"] },
  40: { desc: "Butterscotch ice cream is a creamy dessert with sweet caramel-like flavor.", ing: ["Milk", "Cream", "Butterscotch"], prep: ["Cup", "Cone"] },
  41: { desc: "Cupcake is a small cake topped with sweet frosting.", ing: ["Flour", "Butter", "Sugar"], prep: ["Standard"] },
  42: { desc: "Banana bread is a soft baked bread made with mashed bananas.", ing: ["Banana", "Flour", "Sugar"], prep: ["Warm", "Room Temperature"] },
  45: { desc: "Chocolate croissant is a buttery pastry filled with melted chocolate.", ing: ["Flour", "Butter", "Chocolate"], prep: ["Warm"] },
  46: { desc: "Cinnamon roll is a sweet pastry rolled with cinnamon and sugar.", ing: ["Flour", "Cinnamon", "Sugar"], prep: ["Warm", "Extra Icing"] },
  47: { desc: "Chicken sandwich is made with chicken and vegetables between bread slices.", ing: ["Bread", "Chicken", "Vegetables"], prep: ["Grilled", "Toasted"] },
  100: { desc: "Mango smoothie is a refreshing drink made by blending ripe mangoes.", ing: ["Mango", "Milk", "Yogurt"], prep: ["Thick", "No Ice"] },
  101: { desc: "Strawberry banana smoothie is a creamy drink made from strawberries and bananas.", ing: ["Strawberry", "Banana", "Milk"], prep: ["Standard", "Thick"] },
  102: { desc: "Dragon fruit smoothie is a colorful and refreshing drink.", ing: ["Dragon Fruit", "Juice"], prep: ["No Sugar"] },
  103: { desc: "Mixed berry smoothie is made with a mix of berries.", ing: ["Mixed Berries", "Juice"], prep: ["Thick"] },
  104: { desc: "Orange avocado smoothie is a unique blend of citrus and creamy avocado.", ing: ["Orange", "Avocado"], prep: ["Smooth"] },
  105: { desc: "Watermelon cooler is a refreshing drink made from fresh watermelon.", ing: ["Watermelon", "Ice"], prep: ["Extra Cold"] },
  106: { desc: "Green Detox is a refreshing and healthy drink made with hydrating ingredients.", ing: ["Cucumber", "Leafy Greens", "Green Apple", "Lemon", "Ginger"], prep: ["No Sugar"] },
  107: { desc: "Banana shake is a thick and sweet drink made with bananas and milk.", ing: ["Banana", "Milk"], prep: ["Extra Thick"] },
  108: { desc: "Strawberry milkshake is a creamy drink made with strawberry ice cream and milk.", ing: ["Strawberry Ice Cream", "Milk"], prep: ["Thick"] },
  109: { desc: "Chocolate milkshake is a rich drink made with chocolate ice cream and milk.", ing: ["Chocolate Ice Cream", "Milk"], prep: ["Thick"] },
  110: { desc: "Strawberry juice is a refreshing drink made from fresh strawberries.", ing: ["Strawberry", "Ice"], prep: ["No Sugar"] },
  111: { desc: "Oreo shake is a creamy drink blended with Oreo biscuits and milk.", ing: ["Milk", "Oreo", "Ice Cream"], prep: ["Extra Oreo"] },
  112: { desc: "Kiwi smoothie is a slightly tangy and refreshing drink.", ing: ["Kiwi", "Juice"], prep: ["No Sugar"] },
  113: { desc: "Caramel frappe is a cold coffee drink blended with ice and caramel syrup.", ing: ["Coffee", "Milk", "Caramel"], prep: ["Extra Caramel"] },
  114: { desc: "Refreshing muskmelon blended with milk and sweet cream.", ing: ["Muskmelon", "Milk", "Cream"], prep: ["Less Sweet"] }
};

const RAW_MENU_ITEMS = [
  { id: 1, name: 'Espresso', category: 'Coffee', type: 'Veg', tempType: 'hot', price: 150, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500&q=80', variants: vEspresso(150) },
  { id: 2, name: 'Cappuccino', category: 'Coffee', type: 'Veg', tempType: 'hot', price: 180, image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=500&q=80', variants: vCoffee(180) },
  { id: 3, name: 'Latte', category: 'Coffee', type: 'Veg', tempType: 'hot', price: 200, image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=500&q=80', variants: vCoffee(200) },
  { id: 4, name: 'Cold Brew', category: 'Coffee', type: 'Veg', tempType: 'cold', price: 220, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&q=80', variants: vCoffee(220) },
  { id: 5, name: 'Mocha', category: 'Coffee', type: 'Veg', tempType: 'hot', price: 210, image: 'https://images.unsplash.com/photo-1619286310410-a95de97b0aec?w=500&q=80&auto=format&fit=crop', variants: vCoffee(210) },
  { id: 6, name: 'Americano', category: 'Coffee', type: 'Veg', tempType: 'hot', price: 150, image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=500&q=80', variants: vCoffee(150) },
  { id: 7, name: 'Iced Coffee', category: 'Coffee', type: 'Veg', tempType: 'cold', price: 190, image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&q=80&auto=format&fit=crop', variants: vCoffee(190) },
  { id: 8, name: 'Flat White', category: 'Coffee', type: 'Veg', tempType: 'hot', price: 200, image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=500&q=80', variants: vCoffee(200) },
  { id: 9, name: 'Caramel Latte', category: 'Coffee', type: 'Veg', tempType: 'hot', price: 230, image: 'https://images.pexels.com/photos/214333/pexels-photo-214333.jpeg?auto=compress&cs=tinysrgb&w=500', variants: vCoffee(230) },
  { id: 10, name: 'Vanilla Latte', category: 'Coffee', type: 'Veg', tempType: 'hot', price: 220, image: 'https://images.pexels.com/photos/4869287/pexels-photo-4869287.jpeg?auto=compress&cs=tinysrgb&w=500', variants: vCoffee(220) },
  { id: 34, name: 'Macchiato', category: 'Coffee', type: 'Veg', tempType: 'hot', price: 220, image: 'https://images.unsplash.com/photo-1563090308-5a7889e40542?w=500&q=80&auto=format&fit=crop', variants: vEspresso(220) },
  { id: 35, name: 'Cortado', category: 'Coffee', type: 'Veg', tempType: 'hot', price: 220, image: 'https://images.unsplash.com/photo-1519532059956-a63a37af5deb?w=500&q=80&auto=format&fit=crop', variants: vEspresso(220) },
  { id: 36, name: 'Drip Coffee', category: 'Coffee', type: 'Veg', tempType: 'hot', price: 300, image:'https://images.unsplash.com/photo-1643427517196-7822b972517f?w=500&q=80&auto=format&fit=crop', variants: vCoffee(300)},
  { id: 37, name: 'Fresh Press', category: 'Coffee', type: 'Veg', tempType: 'hot', price: 320, image: 'https://images.pexels.com/photos/36450276/pexels-photo-36450276.jpeg?auto=compress&cs=tinysrgb&w=500', variants: vCoffee(320)},
  { id: 38, name: 'Affogato', category: 'Coffee', type: 'Veg', tempType: 'mixed', price: 280, image: 'https://images.pexels.com/photos/36579970/pexels-photo-36579970.png?auto=compress&cs=tinysrgb&w=500', variants: vCoffee(280)},
  { id: 39, name: 'Irish Coffee', category: 'Coffee', type: 'Veg', tempType: 'hot', price: 280, image: 'https://images.pexels.com/photos/10725922/pexels-photo-10725922.jpeg?auto=compress&cs=tinysrgb&w=500', variants: vCoffee(280)},
  { id: 100, name: 'Mango Smoothie', category: 'Smoothies & Shakes', type: 'Veg', tempType: 'cold', price: 180, image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=500&q=80', variants: vCoffee(180) },
  { id: 101, name: 'Strawberry Banana Smoothie', category: 'Smoothies & Shakes', type: 'Veg', tempType: 'cold', price: 210, image: 'https://images.pexels.com/photos/29653642/pexels-photo-29653642.jpeg?auto=compress&cs=tinysrgb&w=500', variants: vCoffee(210) },
  { id: 102, name: 'Dragon Fruit Punch', category: 'Smoothies & Shakes', type: 'Veg', tempType: 'cold', price: 190, image: 'https://images.pexels.com/photos/12144880/pexels-photo-12144880.jpeg?auto=compress&cs=tinysrgb&w=500', variants: vCoffee(190) },
  { id: 103, name: 'Mixed Berry Power', category: 'Smoothies & Shakes', type: 'Veg', tempType: 'cold', price: 220, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&q=80', variants: vCoffee(220) },
  { id: 104, name: 'Orange Avocado Smoothie', category: 'Smoothies & Shakes', type: 'Veg', tempType: 'cold', price: 170, image: 'https://images.unsplash.com/photo-1654084767590-a38c7f0f5bd3?w=500&q=80&auto=format&fit=crop', variants: vCoffee(170) },
  { id: 105, name: 'Watermelon Slush', category: 'Smoothies & Shakes', type: 'Veg', tempType: 'cold', price: 150, image: 'https://images.unsplash.com/photo-1721363005742-d83ecaea4979?w=500&q=80', variants: vCoffee(150) },
  { id: 106, name: 'Green Detox', category: 'Smoothies & Shakes', type: 'Veg', tempType: 'cold', price: 250, image: 'https://images.unsplash.com/photo-1755553860286-324efe8bf892?w=500&q=80', variants: vCoffee(250) },
  { id: 107, name: 'Banana Shake', category: 'Smoothies & Shakes', type: 'Veg', tempType: 'cold', price: 200, image: 'https://images.pexels.com/photos/15481508/pexels-photo-15481508.jpeg?auto=compress&cs=tinysrgb&w=500', variants: vCoffee(200) },
  { id: 108, name: 'Strawberry MilkShake', category: 'Smoothies & Shakes', type: 'Veg', tempType: 'cold', price: 180, image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&q=80', variants: vCoffee(180) },
  { id: 109, name: 'Rich Chocolate MilkShake', category: 'Smoothies & Shakes', type: 'Veg', tempType: 'cold', price: 190, image: 'https://images.unsplash.com/photo-1590373927063-cb2d69209a8b?w=500&q=80&auto=format&fit=crop', variants: vCoffee(190) },
  { id: 110, name: 'Strawberry Smoothie', category: 'Smoothies & Shakes', type: 'Veg', tempType: 'cold', price: 190, image: 'https://images.unsplash.com/photo-1553177595-4de2bb0842b9?w=500&q=80', variants: vCoffee(190) },
  { id: 111, name: 'Oreo Crumble Shake', category: 'Smoothies & Shakes', type: 'Veg', tempType: 'cold', price: 220, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80', variants: vCoffee(220) },
  { id: 112, name: 'Kiwi', category: 'Smoothies & Shakes', type: 'Veg', tempType: 'cold', price: 210, image: 'https://images.pexels.com/photos/8679377/pexels-photo-8679377.jpeg?auto=compress&cs=tinysrgb&w=500', variants: vCoffee(210) },
  { id: 113, name: 'Caramel Frappe', category: 'Smoothies & Shakes', type: 'Veg', tempType: 'cold', price: 230, image: 'https://plus.unsplash.com/premium_photo-1695035005979-0682199ef755?w=500&q=80', variants: vCoffee(230) },
  { id: 114, name: 'Muskmelon Shake', category: 'Smoothies & Shakes', type: 'Veg', tempType: 'cold', price: 240, image: 'https://image.cdn.shpy.in/403544/SKU-1521_0-1740644283580.jpg??w=500&q=80', variants: vCoffee(240) },
  { id: 11, name: 'Butter Croissant', category: 'Bakery', type: 'Veg', price: 120, image: 'https://images.unsplash.com/photo-1619540158579-1b4fd3529849?w=500&q=80&auto=format&fit=crop', variants: vFood(120) },
  { id: 45, name: "Chocolate Croissant", category: "Bakery", type: "Veg", price: 160, image: "https://images.unsplash.com/photo-1718897266472-5b7229ebdd3d?w=500&q=80&auto=format&fit=crop", variants: vFood(160) },
  { id: 12, name: 'Blueberry Muffins', category: 'Bakery', type: 'Veg', price: 130, image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500&q=80', variants: vFood(130) },
  { id: 13, name: 'Choco Chip Cookies', category: 'Bakery', type: 'Veg', price: 100, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&q=80&auto=format&fit=crop', variants: vFood(100) },
  { id: 14, name: 'Fudge Brownies', category: 'Bakery', type: 'Veg', price: 140, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80', variants: vFood(140) },
  { id: 17, name: 'Garlic Bread', category: 'Bakery', type: 'Veg', price: 140, image: 'https://plus.unsplash.com/premium_photo-1711752902734-a36167479983?w=500&q=80&auto=format&fit=crop', variants: vFood(140) },
  { id: 42, name: "Banana Bread", category: "Bakery", type: "Veg", price: 140, image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&q=80&auto=format&fit=crop", variants: vFood(140) },
  { id: 46, name: "Cinnamon Roll", category: "Bakery", type: "Veg", price: 170, image: "https://images.pexels.com/photos/20449475/pexels-photo-20449475.jpeg?auto=compress&cs=tinysrgb&w=500", variants: vFood(170) },
  { id: 15, name: 'Veg Sandwich', category: 'Fast Food', type: 'Veg', price: 200, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&q=80', variants: vMeal(200) },
  { id: 16, name: 'Veg Cheese Sandwich', category: 'Fast Food', type: 'Veg', price: 180, image: 'https://images.unsplash.com/photo-1639744093378-b2fde867b4d8?w=500&q=80&auto=format&fit=crop', variants: vMeal(180) },
  { id: 47, name: 'Chicken Sandwich', category: 'Fast Food', type: "Non-Veg", price: 250, image: 'https://images.pexels.com/photos/33755315/pexels-photo-33755315.jpeg?auto=compress&cs=tinysrgb&w=500', variants: vMeal(250) },
  { id: 19, name: 'Veg Burger', category: 'Fast Food', type: 'Veg', price: 200, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80&auto=format&fit=crop', variants: vMeal(200) },
  { id: 20, name: 'Chicken Burger', category: 'Fast Food', type: 'Non-Veg', price: 250, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80', variants: vMeal(250) },
  { id: 21, name: 'French Fries', category: 'Fast Food', type: 'Veg', price: 180, image: 'https://images.pexels.com/photos/3926126/pexels-photo-3926126.jpeg?auto=compress&cs=tinysrgb&w=500', variants: vSides(180) },
  { id: 18, name: 'Chicken Pizza', category: 'Fast Food', type: 'Non-Veg', price: 280, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80', variants: vPizza(280) },
  { id: 22, name: 'Peperino pizza', category: 'Fast Food', type: 'Veg', price: 250, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80', variants: vPizza(250) },
  { id: 23, name: 'Chicken Wrap', category: 'Fast Food', type: 'Non-Veg', price: 300, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&q=80&auto=format&fit=crop', variants: vMeal(300) },
  { id: 24, name: 'Cheesecake', category: 'Desserts', type: 'Veg', price: 220, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80', variants: vCake(220) },
  { id: 25, name: 'Chocolate Cake', category: 'Desserts', type: 'Veg', price: 200, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80', variants: vCake(200) },
  { id: 41, name: 'Cup Cake', category: 'Desserts', type: 'Veg', price: 200, image: 'https://images.unsplash.com/photo-1614707269211-474b2510b3ad?w=500&q=80&auto=format&fit=crop', variants: vFood(200) },
  { id: 26, name: 'Vanilla Ice Cream', category: 'Desserts', type: 'Veg', price: 150, image: 'https://images.pexels.com/photos/16630827/pexels-photo-16630827.jpeg?auto=compress&cs=tinysrgb&w=500', variants: vIceCream(150) },
  { id: 27, name: 'Chocolate Ice Cream', category: 'Desserts', type: 'Veg', price: 150, image: 'https://images.unsplash.com/photo-1636696301991-3e176a6b77dc?w=500&q=80&auto=format&fit=crop', variants: vIceCream(150) },
  { id: 28, name: 'Strawberry Ice Cream', category: 'Desserts', type: 'Veg', price: 150, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&q=80', variants: vIceCream(150) },
  { id: 40, name: 'Butterscotch Ice Cream', category: 'Desserts', type: 'Veg', price: 150, image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&q=80&auto=format&fit=crop', variants: vIceCream(150) },
  { id: 29, name: 'Waffles', category: 'Desserts', type: 'Veg', price: 180, image: 'https://images.unsplash.com/photo-1549661704-c192f6238169?w=500&q=80&auto=format&fit=crop', variants: vFood(180) },
  { id: 30, name: 'Donuts', category: 'Desserts', type: 'Veg', price: 130, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&q=80', variants: vFood(130) },
  { id: 31, name: 'Brownie Sundae', category: 'Desserts', type: 'Veg', price: 190, image: 'https://images.pexels.com/photos/36032862/pexels-photo-36032862.jpeg?auto=compress&cs=tinysrgb&w=500', variants: vIceCream(190) },
  { id: 32, name: 'Tiramisu', category: 'Desserts', type: 'Veg', price: 240, image: 'https://images.pexels.com/photos/6403383/pexels-photo-6403383.jpeg?auto=compress&cs=tinysrgb&w=500', variants: vFood(240) },
  { id: 33, name: 'Fruit Tart', category: 'Desserts', type: 'Veg', price: 200, image: 'https://images.pexels.com/photos/4748363/pexels-photo-4748363.jpeg?auto=compress&cs=tinysrgb&w=500', variants: vFood(200) },
];

const MENU_ITEMS = RAW_MENU_ITEMS.map(item => {
  const data = UNIQUE_ITEM_DATA[item.id] || { 
    desc: "A premium, handcrafted delight prepared fresh.", 
    ing: ["Premium Ingredients", "Secret Recipe"], 
    prep: ["Standard", "Extra Care"] 
  };

  let customizations = {};
  if (item.category === 'Coffee' || item.category === 'Smoothies & Shakes') {
    const tempType = item.tempType || 'hot';
    let temperatureOptions = [];
    const desc = data.desc.toLowerCase();

    if (desc.includes('iced') || desc.includes('cold') || desc.includes('smoothie') || desc.includes('shake') || desc.includes('frappe')) {
      temperatureOptions = ["Iced", "Less Ice", "No Ice"];
    } else if (desc.includes('hot') && !desc.includes('iced')) {
      temperatureOptions = ["Hot", "Extra Hot", "Warm"];
    } else if (tempType === 'mixed') {
      temperatureOptions = ["Hot Espresso Pour", "Chilled Scoop", "Balanced"];
    } else if (tempType === 'cold') {
      temperatureOptions = ["Iced", "Less Ice", "No Ice"];
    } else {
      temperatureOptions = ["Hot", "Extra Hot", "Warm"];
    }

    customizations = { 
      "Sugar Level": ["Normal", "Less", "None", "Extra"], 
      "Temperature": temperatureOptions,
    };

    if (item.category === 'Coffee') {
      customizations["Milk Type"] = ["Regular", "Oat", "Almond", "Soy"];
      customizations["Strength"] = ["Standard", "Extra Shot", "Light"];
    } else {
      customizations["Consistency"] = ["Standard", "Extra Thick"];
    }
  } else if (item.category === 'Fast Food') {
    if(item.name.toLowerCase().includes('pizza')) {
      customizations = { "Base": ["Thin Crust", "Thick Crust", "Cheese Burst"], "Cheese": ["Normal", "Extra Mozzarella"] };
    } else {
      customizations = { "Style": ["Grilled", "Toasted", "Crispy"], "Cheese": ["Normal", "Extra Cheese", "No Cheese"] };
    }
  } else {
    customizations = { "Preparation": ["Serve as is", "Warm it up"] };
  }
  
  const optimizedImg = item.image.includes('unsplash') 
    ? item.image.split('?')[0] + '?w=400&q=50&fm=webp&fit=crop'
    : item.image.includes('pexels') 
    ? item.image.split('?')[0] + '?auto=compress&cs=tinysrgb&w=400&fm=webp'
    : item.image;

  return { 
    ...item, 
    image: optimizedImg, 
    description: data.desc, 
    customizations, 
    ingredients: data.ing, 
    prepOptions: data.prep, 
    isPopular: isItemPopular(item.id) 
  };
});

// ==========================================
// 3. THEME CONSTANTS & UTILS
// ==========================================
const THEME = {
  bg: 'bg-[#FDFCFB] dark:bg-[#12100E]',
  text: 'text-[#2D241E] dark:text-[#EAE6DF]',
  cardBg: 'bg-white dark:bg-[#1C1917]',
  primary: 'bg-[#6F4E37] hover:bg-[#5A3E2B] text-white',
  primaryText: 'text-[#6F4E37] dark:text-[#D4B895]',
  border: 'border-[#EAE6DF] dark:border-white/25',
  muted: 'text-[#8A7B72] dark:text-[#A89F95]'
};

const formatPrice = (price) => `₹${(price || 0).toLocaleString('en-IN')}`;

const randomCouponAmount = () => {
  const raw = Math.floor(Math.random() * (1000 - 20 + 1)) + 20;
  return Math.round(raw / 10) * 10;
};

const generateRewardCoupons = (count) => {
  const seenCodes = new Set();
  const coupons = [];

  while (coupons.length < count) {
    const amount = randomCouponAmount();
    const code = `BB${amount}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    if (seenCodes.has(code)) continue;
    seenCodes.add(code);
    coupons.push({ code, amount, used: false, createdAt: Date.now() + coupons.length });
  }

  return coupons;
};

// ==========================================
// 4. COMPONENTS
// ==========================================

const Toast = ({ message, visible }) => (
  <div className={`fixed bottom-24 md:bottom-12 left-1/2 -translate-x-1/2 bg-black/90 dark:bg-white/90 text-white dark:text-black px-6 py-3 rounded-full shadow-2xl z-[400] transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
    <span className="font-semibold text-sm whitespace-nowrap">{message}</span>
  </div>
);

// 🔥 3. SCRATCH CARD MODAL (NEW COMPONENT)
// 🔥 3. SCRATCH CARD MODAL (UPDATED WITH SAFE COPY)
const ScratchCardModal = ({ isOpen, onClose, rewardCoupons, onClaimCoupon }) => {
  const canvasRef = useRef(null);
  const [isScratched, setIsScratched] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeCoupon = rewardCoupons[currentIndex];

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Fill with Silver
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    setIsScratched(false);
  }, [isOpen, currentIndex]);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setIsScratched(false);
    }
  }, [isOpen]);

  const scratch = (e) => {
    if (isScratched) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Check how much is scratched
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clearPixels = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) clearPixels++;
    }
    const percentage = (clearPixels / (canvas.width * canvas.height)) * 100;

    if (percentage > 50 && !isScratched) {
      setIsScratched(true);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      import('canvas-confetti').then((confetti) => {
        confetti.default({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }).catch(() => console.log('Confetti loaded without module'));
    }
  };

  // Safe Copy Function to bypass iframe restrictions
  const handleCopyCode = () => {
    if (!activeCoupon) return;
    const codeToCopy = activeCoupon.code;
    
    // Fallback method for restricted environments
    const fallbackCopy = (text) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      // Prevent scrolling to bottom of page
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        alert("Copied successfully!");
      } catch (err) {
        alert("Could not copy automatically. Please note down: " + text);
      }
      document.body.removeChild(textArea);
    };

    // Try modern API first, fallback if it fails or is blocked
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => alert("Copied successfully!"))
        .catch(() => fallbackCopy(codeToCopy));
    } else {
      fallbackCopy(codeToCopy);
    }
  };

  const handleClaimAndContinue = () => {
    if (!activeCoupon) return;
    onClaimCoupon(activeCoupon);

    if (currentIndex < rewardCoupons.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsScratched(false);
      return;
    }

    onClose();
  };

  if (!isOpen || !activeCoupon) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#1C1917] rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden">
        <h2 className="text-2xl font-black text-[#2D241E] dark:text-white mb-2">Mystery Reward!</h2>
        <p className="text-sm text-[#8A7B72] mb-2">Reward {currentIndex + 1} of {rewardCoupons.length}</p>
        <p className="text-sm text-[#8A7B72] mb-6">Scratch to reveal your coupon.</p>
        
        <div className="relative w-64 h-32 mx-auto bg-[#FDFCFB] border-2 border-[#D4B895] rounded-2xl flex items-center justify-center overflow-hidden touch-none">
          <div className="flex flex-col items-center justify-center">
            <span className="text-lg font-black text-[#6F4E37]">SAVE {formatPrice(activeCoupon.amount)}</span>
            <span className="text-xs font-bold tracking-wider text-[#2D241E]">{activeCoupon.code}</span>
          </div>
          <canvas 
            ref={canvasRef}
            key={`scratch-card-${currentIndex}`}
            width={256}
            height={128}
            className="absolute inset-0 cursor-pointer"
            onMouseMove={(e) => e.buttons === 1 && scratch(e)}
            onTouchMove={scratch}
          />
        </div>

        {isScratched && (
          <div className="mt-6 animate-pop-in">
            <button onClick={handleCopyCode} className="w-full py-3 mb-2 rounded-xl font-bold border-2 border-[#6F4E37] text-[#6F4E37]">
              Copy Code
            </button>
            <button onClick={handleClaimAndContinue} className={`w-full py-3 rounded-xl font-bold text-white bg-[#6F4E37]`}>
              {currentIndex < rewardCoupons.length - 1 ? 'Claim & Next Card' : 'Claim & Close'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 🔥 HAMBURGER CHECKOUT MODAL (NEW COMPONENT)
// 🔥 HAMBURGER CHECKOUT MODAL (UPDATED FOR UPI + CASH & SUCCESS SCREEN)
// 🔥 SMART CHECKOUT MODAL (SEPARATES UNPAID VS PAID ORDERS)
const BillSettlementModal = ({ isOpen, onClose, orders, onSettleBill }) => {
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);

  useEffect(() => {
    if (isOpen) { setIsSuccess(false); setUpiId(''); setPaymentMethod('UPI'); }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const validOrders = orders.filter(o => o.status !== 'Rejected');
      const unpaidOrders = validOrders.filter(o => !o.isPaid);
      setSelectedOrderIds(unpaidOrders.map((order) => order.id));
    }
  }, [isOpen, orders]);

  if (!isOpen) return null;

  // Filter out rejected orders, then split by payment status
  const validOrders = orders.filter(o => o.status !== 'Rejected');
  const unpaidOrders = validOrders.filter(o => !o.isPaid);
  const paidOrders = validOrders.filter(o => o.isPaid);

  const selectedUnpaidOrders = unpaidOrders.filter((order) => selectedOrderIds.includes(order.id));
  const totalToPay = selectedUnpaidOrders.reduce((sum, o) => sum + o.total, 0);
  const totalPaid = paidOrders.reduce((sum, o) => sum + o.total, 0);

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
        <div className={`${THEME.cardBg} w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl relative`}>
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={40} /></div>
          <h2 className="text-2xl font-black text-[#2D241E] dark:text-white mb-2">{paymentMethod === 'UPI' ? 'Payment Successful!' : 'Order Confirmed!'}</h2>
          <p className="text-[#8A7B72] mb-8">{paymentMethod === 'UPI' ? 'Your bill is settled. Thank you!' : 'Please pay cash at the counter.'}</p>
          <button onClick={onClose} className={`w-full py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105 active:scale-95 ${THEME.primary}`}>Continue</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className={`${THEME.cardBg} w-full max-w-md rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]`}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/5 dark:bg-white/5 rounded-full z-10"><X size={20} className="text-[#2D241E] dark:text-white"/></button>
        <h2 className="text-2xl font-black text-[#2D241E] dark:text-white mb-6 flex items-center gap-2"><CreditCard className="text-[#6F4E37]" /> Pay Bill</h2>
        
        <div className="overflow-y-auto mb-6 bg-black/5 dark:bg-white/5 p-4 rounded-2xl hide-scrollbar flex-1">
          
          {/* UNPAID ORDERS SECTION */}
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A7B72] mb-3">Current Unpaid Orders</h3>
          {unpaidOrders.length === 0 ? (
             <p className="text-sm text-green-600 dark:text-green-400 font-bold mb-4 flex items-center gap-1"><CheckCircle2 size={16}/> All caught up! No pending bills.</p>
          ) : (
            <div className="mb-4 space-y-2">
              {unpaidOrders.map(o => (
                <label key={o.id} className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-2 last:border-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedOrderIds.includes(o.id)}
                    onChange={(event) => {
                      setSelectedOrderIds((prev) => event.target.checked
                        ? [...prev, o.id]
                        : prev.filter((id) => id !== o.id)
                      )
                    }}
                    className="h-4 w-4 accent-[#6F4E37]"
                  />
                  <span className="flex-1 text-sm font-semibold text-[#2D241E] dark:text-white">Order #{o.id}</span>
                  <span className="text-sm font-bold text-[#6F4E37] dark:text-[#D4B895]">₹{o.total}</span>
                </label>
              ))}
            </div>
          )}

          {/* PREVIOUSLY PAID SECTION */}
          {paidOrders.length > 0 && (
            <div className="pt-4 border-t border-black/10 dark:border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A7B72] mb-3">Previously Paid</h3>
              <div className="space-y-2 opacity-60">
                {paidOrders.map(o => (
                  <div key={o.id} className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-[#2D241E] dark:text-white">Order #{o.id}</span>
                    <span className="text-sm font-bold text-[#2D241E] dark:text-white">₹{o.total} <span className="text-[10px] text-green-600 ml-1">(Paid)</span></span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PAYMENT UI - ONLY SHOW IF THERE IS A BALANCE */}
        {totalToPay > 0 ? (
          <div className="animate-fade-in shrink-0">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-[#8A7B72]">Amount Due</span>
              <span className="text-3xl font-black text-[#2D241E] dark:text-white">₹{totalToPay}</span>
            </div>
            
            <h3 className="text-sm font-bold text-[#2D241E] dark:text-white mb-3">Payment Method</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button onClick={() => setPaymentMethod('UPI')} className={`py-3 rounded-xl border-2 font-bold flex flex-col items-center gap-2 transition-colors ${paymentMethod === 'UPI' ? 'border-[#6F4E37] bg-[#6F4E37]/10 text-[#6F4E37] dark:border-[#D4B895] dark:text-[#D4B895] dark:bg-[#D4B895]/10' : 'border-black/10 dark:border-white/10 text-[#8A7B72]'}`}>UPI / QR</button>
              <button onClick={() => setPaymentMethod('CASH')} className={`py-3 rounded-xl border-2 font-bold flex flex-col items-center gap-2 transition-colors ${paymentMethod === 'CASH' ? 'border-[#6F4E37] bg-[#6F4E37]/10 text-[#6F4E37] dark:border-[#D4B895] dark:text-[#D4B895] dark:bg-[#D4B895]/10' : 'border-black/10 dark:border-white/10 text-[#8A7B72]'}`}>Cash at Counter</button>
            </div>

            {paymentMethod === 'UPI' ? (
              <div className="mb-6"><input type="text" placeholder="Enter your UPI ID (e.g., name@upi)" value={upiId} onChange={(e) => setUpiId(e.target.value)} className={`w-full p-4 rounded-xl border ${THEME.border} bg-transparent outline-none focus:border-[#6F4E37] text-[#2D241E] dark:text-white`} /></div>
            ) : (
              <div className="mb-6 p-4 bg-black/5 dark:bg-white/5 rounded-xl text-center"><p className="text-sm text-[#8A7B72] font-medium">You will pay <span className="font-bold text-[#2D241E] dark:text-white">₹{totalToPay}</span> at the counter.</p></div>
            )}

            <button 
              onClick={() => { 
                if (paymentMethod === 'UPI' && !upiId.includes('@')) return alert('Please enter a valid UPI ID containing "@"'); 
                if (selectedOrderIds.length === 0) return alert('Please select at least one order to pay.');
                onSettleBill(selectedOrderIds);
                setIsSuccess(true); 
              }} 
              className={`w-full py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105 active:scale-95 ${THEME.primary}`}
            >
              Confirm Payment
            </button>
          </div>
        ) : (
          <div className="shrink-0 animate-fade-in border-t border-black/10 dark:border-white/10 pt-4">
             <div className="flex justify-between items-center mb-6">
               <span className="text-lg font-bold text-[#8A7B72]">Total Paid</span>
               <span className="text-3xl font-black text-green-600 dark:text-green-400">₹{totalPaid}</span>
             </div>
             <button onClick={onClose} className={`w-full py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105 active:scale-95 bg-black/10 dark:bg-white/10 text-[#2D241E] dark:text-white`}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};
const Navbar = ({ cartCount, setIsCartOpen, unreadNotif, onNotifClick, adminBadgeCount, orderMode, tableNumber, onModeChangeClick, setIsMobileMenuOpen, isTableLocked, onAdminClick }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? `${THEME.cardBg} shadow-sm py-4` : 'bg-transparent py-6'} px-4 md:px-8 lg:px-12 xl:px-24`}>
      <div className="w-full mx-auto grid grid-cols-[auto_1fr_auto] items-center gap-2 md:gap-4">
        
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="p-1 rounded-xl transition-transform duration-300 group-hover:rotate-12">
            <img src="/favicon.svg" alt="BrewBite" className="h-10 w-10 rounded-xl object-cover shadow-sm" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#2D241E] dark:text-white hidden sm:block">Brew<span className="font-light">Bite</span></span>
        </div>

        <div className="flex justify-center px-1">
          <div className={`flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full transition-colors w-full max-w-[180px] sm:max-w-[240px] md:w-auto md:max-w-none ${isTableLocked ? 'bg-black/5 dark:bg-white/10 cursor-not-allowed' : 'bg-black/5 dark:bg-white/10 cursor-pointer hover:bg-black/10 dark:hover:bg-white/20'}`} onClick={() => !isTableLocked && onModeChangeClick()}>
               {orderMode === 'Dine-In' ? <MapPin size={16} className="text-[#6F4E37] dark:text-[#D4B895]"/> : <Package size={16} className="text-[#6F4E37] dark:text-[#D4B895]"/>}
               <span className="text-xs md:text-sm font-bold text-[#2D241E] dark:text-white truncate max-w-[120px] md:max-w-none">
                 {orderMode === 'Dine-In' ? `Table ${tableNumber}` : 'Takeaway'}
               </span>
               {!isTableLocked && <span className="text-[10px] md:text-xs text-[#6F4E37] dark:text-[#D4B895] font-bold ml-1 uppercase hidden sm:block">Change</span>}
          </div>
        </div>

        <div className="flex items-center gap-0.5 sm:gap-2 justify-self-end">
            
            {/* 🔥 NEW CART BUTTON IN NAVBAR 🔥 */}
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-[#2D241E] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors active:scale-95 flex items-center justify-center min-h-[48px] min-w-[48px]">
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#6F4E37] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FAF7F2] dark:border-[#1C1917] shadow-sm animate-pop-in">
                  {cartCount}
                </span>
              )}
            </button>

            <button onClick={onNotifClick} className="relative p-2 rounded-full text-[#2D241E] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <Bell size={20} className={unreadNotif > 0 ? 'animate-bounce text-[#6F4E37]' : ''} />
              {unreadNotif > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-[#6F4E37] text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-[#FAF7F2] dark:border-[#1C1917] shadow-sm">{unreadNotif}</span>}
            </button>

            <button onClick={onAdminClick} className="relative p-2 rounded-full text-[#2D241E] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors" title="Admin Portal">
              <Lock size={20} />
              {adminBadgeCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-[#6F4E37] text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-[#FAF7F2] dark:border-[#1C1917] shadow-sm">{adminBadgeCount}</span>}
            </button>

            <button className="p-2 text-[#2D241E] dark:text-white transition-transform hover:bg-black/5 dark:hover:bg-white/10 rounded-full flex items-center justify-center" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => (
  <section id="home" className="w-full h-screen flex flex-col items-center justify-center px-4 md:px-6 text-center pt-16">
    <div className="max-w-4xl flex flex-col items-center justify-center gap-6 md:gap-8 animate-fade-in-up">
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#2D241E] dark:text-white leading-tight tracking-tight">
        Brewed for <span className="text-[#6F4E37] dark:text-[#D4B895]">Comfort.</span>
      </h1>
      <p className={`text-lg md:text-xl font-medium ${THEME.muted} opacity-90 max-w-2xl leading-relaxed`}>
        Experience the perfect blend of rich aromas, artisan pastries, and a cozy atmosphere. Ready to be delivered instantly.
      </p>
      <button 
        onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        className={`mt-4 px-12 py-8 rounded-full text-xl font-bold uppercase tracking-wider transition-all duration-500 hover:scale-[1.05] active:scale-95 shadow-[0_15px_30px_rgba(111,78,55,0.4)] ${THEME.primary}`}
      >
        Order Now
      </button>
    </div>
  </section>
);

const ComboBuilder = ({ addToCart }) => {
  const ObjectIds = useMemo(() => {
    const coffees = MENU_ITEMS.filter(i => i.category === 'Coffee');
    const snacks = MENU_ITEMS.filter(i => i.category === 'Fast Food' || i.category === 'Bakery');
    const desserts = MENU_ITEMS.filter(i => i.category === 'Desserts');
    return { coffees, snacks, desserts };
  }, []);

  const [cItem, setCItem] = useState(ObjectIds.coffees[0]);
  const [sItem, setSItem] = useState(ObjectIds.snacks[0]);
  const [dItem, setDItem] = useState(ObjectIds.desserts[0]);

  const originalPrice = cItem.price + sItem.price + dItem.price;
  const comboPrice = Math.round(originalPrice * 0.85);

  const handleAddCombo = () => {
    if (!cItem || !sItem || !dItem) return;
    addToCart({
      id: `combo-${cItem.id}-${sItem.id}-${dItem.id}`,
      name: 'Signature Combo',
      category: 'Combo',
      type: sItem.type === 'Non-Veg' || dItem.type === 'Non-Veg' ? 'Non-Veg' : 'Veg',
      price: comboPrice,
      image: cItem.image,
      variants: [],
      isCombo: true,
      comboItems: [cItem, sItem, dItem]
    });
  };

  return (
    <div className={`mt-8 mb-12 p-6 md:p-8 rounded-[2rem] border ${THEME.border} ${THEME.cardBg} shadow-lg relative overflow-hidden animate-fade-in`}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#6F4E37]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex-1 space-y-4 text-center lg:text-left">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold uppercase tracking-wide`}>
            <Flame size={12} /> Save 15%
          </div>
          <h3 className="text-3xl font-bold text-[#2D241E] dark:text-white">Build Your Perfect Combo</h3>
          <p className={`${THEME.muted} max-w-md mx-auto lg:mx-0`}>Select a beverage, a savory bite, and a sweet treat to unlock a special discounted bundle price.</p>
        </div>
        
        <div className="flex-1 w-full flex flex-col sm:flex-row items-center gap-4">
          {[
            { label: 'Beverage', items: ObjectIds.coffees, state: cItem, setter: setCItem },
            { label: 'Savory Snack', items: ObjectIds.snacks, state: sItem, setter: setSItem },
            { label: 'Sweet Treat', items: ObjectIds.desserts, state: dItem, setter: setDItem },
          ].map((col) => (
            <div key={col.label} className="w-full relative">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${THEME.muted} absolute -top-2 left-3 bg-white dark:bg-[#1C1917] px-1 z-10`}>{col.label}</span>
              <select 
                value={col.state.id}
                onChange={(e) => col.setter(col.items.find(item => item.id == e.target.value))}
                className={`w-full p-4 pt-5 rounded-xl border ${THEME.border} bg-transparent appearance-none cursor-pointer outline-none focus:border-[#6F4E37] text-sm font-semibold text-[#2D241E] dark:text-white min-h-[56px]`}
              >
                {col.items.map(item => <option key={item.id} value={item.id} className="bg-white dark:bg-[#1C1917] text-[#2D241E] dark:text-white">{item.name}</option>)}
              </select>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center min-w-[180px] shrink-0 bg-black/5 dark:bg-white/5 p-4 rounded-2xl">
          <span className="text-sm line-through text-[#8A7B72]">{formatPrice(originalPrice)}</span>
          <span className="text-3xl font-bold text-[#6F4E37] dark:text-[#D4B895]">{formatPrice(comboPrice)}</span>
          <button onClick={handleAddCombo} className={`mt-3 w-full py-3 min-h-[48px] rounded-xl font-bold text-sm transition-transform hover:scale-105 active:scale-95 ${THEME.primary}`}>
            Add Combo
          </button>
        </div>
      </div>
    </div>
  );
};

const QuickViewModal = ({ item, isOpen, onClose, addToCart, toggleFavorite, favorites }) => {
  if (!isOpen || !item) return null;

  const hasVariants = item.variants && item.variants.length > 0;
  const [selectedVariant, setSelectedVariant] = useState(hasVariants ? item.variants[0] : null);
  const [selectedPrep, setSelectedPrep] = useState(item.prepOptions?.[0] || '');
  const [instructions, setInstructions] = useState('');
  const [customs, setCustoms] = useState({});
  const currentPrice = hasVariants ? selectedVariant.price : item.price;
  
  const isFav = favorites.includes(item.id);

  useEffect(() => {
    setSelectedVariant(hasVariants ? item.variants[0] : null);
    setSelectedPrep(item.prepOptions?.[0] || '');
    setInstructions('');
    const defaultCustoms = {};
    if (item.customizations) {
      Object.entries(item.customizations).forEach(([key, options]) => { defaultCustoms[key] = options[0]; });
    }
    setCustoms(defaultCustoms);
  }, [item, isOpen, hasVariants]);
  
  const ratingInfo = getItemRating(item.id);

  const handleAdd = () => {
    addToCart(item, selectedVariant, item.description, customs, instructions, selectedPrep);
    onClose();
  };

  const handleFav = (e) => {
    e.stopPropagation();
    toggleFavorite(item.id);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-5xl max-h-[95vh] overflow-y-auto md:overflow-hidden ${THEME.cardBg} rounded-3xl shadow-2xl flex flex-col md:flex-row animate-slide-down`}>
        
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-full hover:bg-white dark:hover:bg-black transition-colors text-[#2D241E] dark:text-white shadow-sm min-h-[48px] min-w-[48px] flex items-center justify-center">
          <X size={20} />
        </button>
        <button onClick={handleFav} className="absolute top-4 right-20 z-20 p-2 bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-full hover:bg-white dark:hover:bg-black transition-colors shadow-sm min-h-[48px] min-w-[48px] flex items-center justify-center">
          <Heart size={20} fill={isFav ? '#ef4444' : 'transparent'} className={isFav ? 'text-red-500' : 'text-[#2D241E] dark:text-white'} />
        </button>

        <div className="w-full md:w-1/2 md:max-h-[95vh] md:overflow-hidden relative bg-black/5 dark:bg-white/5">
          <img src={item.image} alt={item.name} className="w-full h-auto md:h-full md:sticky md:top-0 object-cover" fetchpriority="high" loading="eager" />
          {item.isPopular && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10 flex items-center gap-1">
              <Flame size={14} /> Popular
            </div>
          )}
        </div>
        
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-start md:overflow-y-auto md:max-h-[95vh] hide-scrollbar">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/5 dark:bg-white/5 ${THEME.primaryText}`}>{item.category}</span>
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${item.type === 'Non-Veg' ? 'border-red-500 text-red-600' : 'border-green-500 text-green-600'}`}>
              <div className={`w-2 h-2 rounded-full ${item.type === 'Non-Veg' ? 'bg-red-500' : 'bg-green-500'}`}></div> {item.type}
            </div>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-[#2D241E] dark:text-white mb-2">{item.name}</h2>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center text-yellow-500">
              <Star size={16} fill="currentColor" />
              <span className="font-bold ml-1">{ratingInfo.rating}</span>
            </div>
            <span className={`text-sm ${THEME.muted}`}>({ratingInfo.reviews} reviews)</span>
          </div>

          <p className={`text-base leading-relaxed mb-6 ${THEME.muted}`}>{item.description}</p>

          <div className="mb-6 space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
             <div>
                <h4 className="font-bold text-sm text-[#2D241E] dark:text-white mb-2">Ingredients</h4>
                <div className="flex flex-wrap gap-2">
                  {item.ingredients?.map(ing => (
                    <span key={ing} className="px-2 py-1 bg-black/5 dark:bg-white/5 rounded-md text-[10px] font-semibold text-[#8A7B72] dark:text-[#A89F95]">{ing}</span>
                  ))}
                </div>
             </div>
             
             {item.prepOptions && item.prepOptions.length > 0 && (
               <div>
                  <h4 className="font-bold text-sm text-[#2D241E] dark:text-white mb-2">Preparation Style</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.prepOptions.map(prep => (
                      <button 
                        key={prep} onClick={() => setSelectedPrep(prep)}
                        className={`px-4 py-2 min-h-[48px] rounded-lg border text-xs font-semibold transition-all ${selectedPrep === prep ? 'border-[#6F4E37] bg-[#6F4E37]/10 text-[#6F4E37] dark:border-[#D4B895] dark:text-[#D4B895] dark:bg-[#D4B895]/10' : `${THEME.border} text-[#8A7B72] dark:text-[#A89F95] hover:border-black/30 dark:hover:border-white/30`}`}
                      >
                        {prep}
                      </button>
                    ))}
                  </div>
               </div>
             )}
          </div>

          {hasVariants && (
            <div className="mb-6 space-y-3">
              <h4 className="font-bold text-[#2D241E] dark:text-white">Size / Quantity</h4>
              <div className="grid grid-cols-3 gap-3">
                {item.variants.map(v => (
                  <button
                    key={v.name} onClick={() => setSelectedVariant(v)}
                    className={`flex flex-col items-center justify-center p-2 min-h-[48px] rounded-xl border-2 transition-all ${selectedVariant?.name === v.name ? 'border-[#6F4E37] bg-[#6F4E37]/10 dark:bg-[#D4B895]/10 dark:border-[#D4B895]' : 'border-transparent bg-black/5 dark:bg-white/5 hover:border-black/10 dark:hover:border-white/10'}`}
                  >
                    <span className={`font-bold text-sm ${selectedVariant?.name === v.name ? 'text-[#6F4E37] dark:text-[#D4B895]' : 'text-[#2D241E] dark:text-white'}`}>{v.name}</span>
                    <span className={`text-xs mt-0.5 ${selectedVariant?.name === v.name ? 'text-[#6F4E37] dark:text-[#D4B895] opacity-90' : THEME.muted}`}>{v.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {item.customizations && Object.keys(item.customizations).length > 0 && (
             <div className="mb-6 space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                {Object.entries(item.customizations).map(([key, options]) => (
                  <div key={key} className="space-y-2">
                    <h4 className="font-bold text-sm text-[#2D241E] dark:text-white capitalize">{key} Options</h4>
                    <div className="flex flex-wrap gap-2">
                      {options.map(opt => (
                        <button key={opt} onClick={() => setCustoms(prev => ({...prev, [key]: opt}))} className={`px-4 py-2 min-h-[48px] rounded-lg border text-xs font-semibold transition-all ${customs[key] === opt ? 'border-[#6F4E37] bg-[#6F4E37]/10 text-[#6F4E37] dark:border-[#D4B895] dark:text-[#D4B895] dark:bg-[#D4B895]/10' : `${THEME.border} text-[#8A7B72] dark:text-[#A89F95] hover:border-black/30 dark:hover:border-white/30`}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
             </div>
          )}

          <div className="mb-8 space-y-2 pt-4 border-t border-black/5 dark:border-white/5">
            <h4 className="font-bold text-sm text-[#2D241E] dark:text-white flex items-center gap-2"><MessageSquare size={16}/> Special Instructions</h4>
            <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="e.g. Less ice, extra spicy..." className={`w-full p-3 rounded-xl border ${THEME.border} bg-transparent outline-none focus:border-[#6F4E37] text-sm text-[#2D241E] dark:text-white resize-none h-20`} />
          </div>

          <div className="mt-auto pt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-6">
            <span className="text-4xl font-bold text-[#2D241E] dark:text-white">{formatPrice(currentPrice)}</span>
            <button onClick={handleAdd} className={`flex-1 py-4 min-h-[48px] rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-transform shadow-xl hover:scale-105 active:scale-95 ${THEME.primary}`}>
              Add to Cart <Plus size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ item, addToCart, updateQuantity, cart, toggleFavorite, favorites, onQuickView }) => {
  const isNonVeg = item.type === 'Non-Veg';
  const hasVariants = item.variants && item.variants.length > 0;
  const [selectedVariant, setSelectedVariant] = useState(hasVariants ? item.variants[0] : null);
  
  const isFav = favorites.includes(item.id);
  
  const ratingInfo = useMemo(() => getItemRating(item.id), [item.id]);
  const currentPrice = hasVariants ? selectedVariant.price : item.price;
  const cartItemId = hasVariants ? `${item.id}-${selectedVariant.name}` : item.id.toString();
  const cartItem = cart.find(c => c.cartItemId === cartItemId);
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  const handleAddOrIncrement = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.uniqueId, 1);
    } else {
      addToCart(item, selectedVariant, item.description, null, '', item.prepOptions?.[0] || '');
    }
  };

  const handleDecrement = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (cartItem) updateQuantity(cartItem.uniqueId, -1);
  };

  const handleFavToggle = (e) => {
    e.stopPropagation();
    toggleFavorite(item.id);
  };

  return (
    <div className={`group flex flex-col justify-between ${THEME.cardBg} rounded-2xl p-4 border ${THEME.border} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in relative w-full`}>
      
      <div>
        <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-xl overflow-hidden mb-4 bg-black/5 dark:bg-white/5 cursor-pointer" onClick={() => onQuickView(item)}>
          <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" fetchpriority="high" loading="lazy" />
          
          <button onClick={handleFavToggle} className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full shadow-md transition-transform hover:scale-110 z-10 min-h-[40px] min-w-[40px] flex items-center justify-center">
            <Heart size={16} fill={isFav ? '#ef4444' : 'transparent'} className={isFav ? 'text-red-500' : 'text-[#2D241E] dark:text-white'} />
          </button>

          {item.isPopular && (
            <div className="absolute bottom-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-10 flex items-center gap-1">
              <Flame size={10} /> Popular
            </div>
          )}
        </div>

        <div className="px-1 mb-3">
          <div className="flex items-center justify-between mb-1">
            <p className={`text-xs font-semibold uppercase tracking-wider ${THEME.primaryText}`}>{item.category}</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-yellow-500 text-[10px] font-bold bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded">
                <Star size={10} fill="currentColor" className="mr-0.5"/> {ratingInfo.rating}
              </div>
              <div className={`flex items-center justify-center w-4 h-4 border ${isNonVeg ? 'border-red-500' : 'border-green-500'} rounded-sm`} title={item.type}>
                <div className={`w-2 h-2 rounded-full ${isNonVeg ? 'bg-red-500' : 'bg-green-500'}`}></div>
              </div>
            </div>
          </div>
          <h3 className="text-lg md:text-xl font-bold mb-2 leading-tight text-[#2D241E] dark:text-[#EAE6DF] cursor-pointer hover:underline decoration-[#6F4E37]" onClick={() => onQuickView(item)}>{item.name}</h3>
        </div>
      </div>
      
      <div className="flex flex-col gap-3 px-1 mt-auto">
        {hasVariants && (
          <div className="grid grid-cols-3 gap-1.5 w-full">
            {item.variants.map(v => (
              <button
                key={v.name} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedVariant(v); }}
                className={`flex flex-col items-center justify-center px-1.5 py-2 min-h-[48px] rounded-xl border transition-all w-full overflow-hidden ${selectedVariant?.name === v.name ? 'border-[#6F4E37] bg-[#6F4E37]/10 dark:bg-[#D4B895]/10 dark:border-[#D4B895]' : 'border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30'}`}
              >
                <span className={`font-bold text-xs md:text-sm leading-tight truncate w-full text-center ${selectedVariant?.name === v.name ? 'text-[#6F4E37] dark:text-[#D4B895]' : 'text-[#2D241E] dark:text-[#EAE6DF]'}`}>{v.name}</span>
                {v.desc && <span className={`text-[10px] md:text-[11px] mt-0.5 truncate w-full text-center ${selectedVariant?.name === v.name ? 'text-[#6F4E37] dark:text-[#D4B895] opacity-90' : 'text-[#8A7B72] dark:text-[#A89F95]'}`}>{v.desc}</span>}
              </button>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-black/5 dark:border-white/10">
          <span className="text-xl md:text-2xl font-bold text-[#2D241E] dark:text-[#EAE6DF]">{formatPrice(currentPrice)}</span>
          
          {cartQuantity > 0 ? (
            <div className="flex items-center justify-between bg-[#6F4E37] text-white rounded-xl px-2 py-1.5 shadow-md animate-fade-in w-28 min-h-[48px]">
              <button onClick={handleDecrement} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"><Minus size={16} strokeWidth={2.5}/></button>
              <span className="text-base font-bold w-6 text-center">{cartQuantity}</span>
              <button onClick={handleAddOrIncrement} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"><Plus size={16} strokeWidth={2.5}/></button>
            </div>
          ) : (
            <button onClick={handleAddOrIncrement} className={`w-28 py-3 min-h-[48px] rounded-xl font-bold text-sm transition-transform shadow-md hover:scale-105 active:scale-95 ${THEME.primary}`}>
              Add +
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const MenuBoard = ({ cart, addToCart, updateQuantity, toggleFavorite, favorites, onQuickView, onRemoveRecentlyViewed, recentlyViewed, recentlyOrdered, dietFilter, setDietFilter }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('default'); 
  
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const searchPlaceholders = useMemo(() => ["Search for dishes...", "Search for coffee...", "Search for ice creams...", "Search for burgers..."], []);
  const [placeholderText, setPlaceholderText] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setPlaceholderText("Search menu...");
      return; 
    }

    const currentString = searchPlaceholders[placeholderIndex];
    let timeout;

    if (isDeleting) {
      timeout = setTimeout(() => {
        setPlaceholderText(currentString.substring(0, charIndex - 1));
        setCharIndex(prev => prev - 1);
      }, 50); 
    } else {
      timeout = setTimeout(() => {
        setPlaceholderText(currentString.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
      }, 100); 
    }

    if (!isDeleting && charIndex === currentString.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000); 
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length); 
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, placeholderIndex, searchPlaceholders, searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const searchLower = searchQuery.toLowerCase().trim();
    return MENU_ITEMS.filter(item => 
      item.name.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower) ||
      item.type.toLowerCase().includes(searchLower)
    ).slice(0, 6);
  }, [searchQuery]);

  const filteredAndSortedMenu = useMemo(() => {
    let results = MENU_ITEMS.filter(item => {
      const searchLower = searchQuery.toLowerCase().trim();
      const isSweet = searchLower.includes('sweet') || searchLower.includes('dessert');
      const isCheap = searchLower.includes('cheap');
      const isVegSearch = searchLower === 'veg';
      const isNonVegSearch = searchLower === 'non veg' || searchLower === 'non-veg';
      const isBurger = searchLower.includes('burger');
      const isCoffee = searchLower === 'coffee';

      if (isSweet && !['Desserts', 'Smoothies & Shakes', 'Bakery'].includes(item.category)) return false;
      if (isVegSearch && item.type !== 'Veg') return false;
      if (isNonVegSearch && item.type !== 'Non-Veg') return false;
      if (isBurger && item.category !== 'Fast Food') return false;
      if (isCoffee && item.category !== 'Coffee') return false;

      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesDiet = dietFilter === 'All' || item.type === dietFilter;
      
      let matchesSearch = true;
      if (searchLower && !isSweet && !isVegSearch && !isNonVegSearch && !isCheap && !isBurger && !isCoffee) {
        matchesSearch = item.name.toLowerCase().includes(searchLower) ||
                        item.category.toLowerCase().includes(searchLower) ||
                        item.type.toLowerCase().includes(searchLower);
      }

      return matchesCategory && matchesDiet && matchesSearch;
    });

    const isCheap = searchQuery.toLowerCase().trim().includes('cheap');
    if (sortOrder === 'asc' || isCheap) results.sort((a, b) => a.price - b.price);
    else if (sortOrder === 'desc') results.sort((a, b) => b.price - a.price);

    return results;
  }, [activeCategory, dietFilter, searchQuery, sortOrder]);

  return (
    <section id="menu" className={`py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 bg-black/[0.02] dark:bg-white/[0.02] w-full relative scroll-mt-24`}>
      <div id="menu-grid" className="w-full mx-auto space-y-10 max-w-[1600px]">
        
        <div className="text-center space-y-4 reveal-on-scroll">
          <h2 className="text-3xl md:text-5xl font-bold text-[#2D241E] dark:text-white">Menu</h2>
          <p className={`max-w-xl mx-auto ${THEME.muted}`}>Curated selections of premium beverages, fresh bakery, and savory bites.</p>
        </div>

        <ComboBuilder addToCart={addToCart} />

        <div className={`sticky top-[80px] md:top-[90px] z-30 pb-4 pt-4 bg-[#FAF7F2] dark:bg-[#12100E] transition-colors border-b border-black/5 dark:border-white/5`} style={{ margin: '0 -100vw', padding: '1rem 100vw' }}>
          <div className="flex flex-col gap-4 reveal-on-scroll max-w-[1600px] mx-auto w-full" style={{ transitionDelay: '0.1s' }}>
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              
              <div ref={searchRef} className="relative w-full lg:w-[60%]">
                <div className={`flex items-center ${THEME.cardBg} rounded-full border ${THEME.border} px-4 py-3 focus-within:border-[#6F4E37] transition-colors shadow-sm`}>
                  <Search size={18} className={THEME.muted} />
                  <input 
                    type="text" 
                    placeholder={placeholderText}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => { setShowSuggestions(true); }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setShowSuggestions(false);
                    }}
                    className="w-full bg-transparent border-none outline-none px-3 text-sm font-medium text-[#2D241E] dark:text-white"
                  />
                  {searchQuery && (
                    <button onClick={() => { setSearchQuery(''); setShowSuggestions(false); }} className={`${THEME.muted} hover:text-red-500 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center`}>
                      <X size={16}/>
                    </button>
                  )}
                </div>

                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className={`absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl shadow-xl ${THEME.cardBg} border ${THEME.border} z-40 animate-slide-down max-h-64 overflow-y-auto hide-scrollbar`}>
                    {searchSuggestions.map(item => (
                      <div 
                        key={item.id}
                        onClick={() => {
                          setSearchQuery(item.name);
                          setShowSuggestions(false);
                          if (activeCategory !== 'All' && activeCategory !== item.category) setActiveCategory('All');
                          if (dietFilter !== 'All' && dietFilter !== item.type) setDietFilter('All');
                        }}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-colors group`}
                      >
                        <span className="font-semibold text-sm group-hover:text-[#6F4E37] transition-colors text-[#2D241E] dark:text-white">{item.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-md bg-black/5 dark:bg-white/5 ${THEME.muted}`}>{item.category}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex w-full lg:w-auto items-center gap-4 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
                <div className={`relative flex items-center ${THEME.cardBg} rounded-full border ${THEME.border} px-4 py-3 focus-within:border-[#6F4E37] transition-colors shadow-sm shrink-0`}>
                  <ArrowUpDown size={16} className={THEME.muted} />
                  <select 
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className={`w-full bg-transparent border-none outline-none px-3 text-sm font-medium appearance-none cursor-pointer ${THEME.text} min-h-[24px]`}
                  >
                    <option value="default" className="bg-white dark:bg-[#1C1917] text-[#2D241E] dark:text-white">Sort by relevance</option>
                    <option value="asc" className="bg-white dark:bg-[#1C1917] text-[#2D241E] dark:text-white">Price: Low to High</option>
                    <option value="desc" className="bg-white dark:bg-[#1C1917] text-[#2D241E] dark:text-white">Price: High to Low</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-[#1C1917] p-1.5 rounded-full border border-gray-200 dark:border-white/15 shadow-sm shrink-0">
                  <button onClick={() => setDietFilter('All')} className={`px-4 py-1.5 min-h-[48px] sm:min-h-0 rounded-full text-sm font-bold transition-all ${dietFilter === 'All' ? 'bg-[#6F4E37] text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}>All</button>
                  <button onClick={() => setDietFilter('Veg')} className={`flex items-center gap-1.5 px-3 py-1.5 min-h-[48px] sm:min-h-0 rounded-full text-sm font-bold transition-all ${dietFilter === 'Veg' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}>
                    <div className="flex items-center justify-center w-3 h-3 border border-green-600 rounded-sm"><div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div></div> Veg
                  </button>
                  <button onClick={() => setDietFilter('Non-Veg')} className={`flex items-center gap-1.5 px-3 py-1.5 min-h-[48px] sm:min-h-0 rounded-full text-sm font-bold transition-all ${dietFilter === 'Non-Veg' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}>
                    <div className="flex items-center justify-center w-3 h-3 border border-red-600 rounded-sm"><div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div></div> Non-Veg
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 w-full pt-2">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`w-full px-4 py-2.5 min-h-[48px] rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeCategory === category 
                      ? `${THEME.primary} shadow-md` 
                      : `${THEME.cardBg} border ${THEME.border} hover:border-[#6F4E37] active:scale-95 text-[#2D241E] dark:text-white`
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

          </div>
        </div>

        {searchQuery === '' && activeCategory === 'All' && dietFilter === 'All' && (
          <>
            {recentlyOrdered.length > 0 && (
              <div id="order-again" className="pt-4 pb-4 animate-fade-in scroll-mt-24">
                <h3 className="text-xl font-bold mb-4 text-[#2D241E] dark:text-white flex items-center gap-2">
                  <Package size={20} className={THEME.primaryText}/> Order Again
                </h3>
                <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar">
                  {recentlyOrdered.map(id => {
                    const item = MENU_ITEMS.find(i => i.id === id);
                    if(!item) return null;
                    const matchingCartItems = cart.filter(cartItem => cartItem.id === item.id);
                    const cartQty = matchingCartItems.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
                    return (
                      <div key={`ordered-${id}`} className={`shrink-0 w-64 flex flex-col p-3 rounded-2xl ${THEME.cardBg} border ${THEME.border} shadow-sm group hover:shadow-md transition-shadow`}>
                        <div className="flex gap-3 mb-3 cursor-pointer" onClick={() => onQuickView(item)}>
                          <img src={item.image} className="w-16 h-16 rounded-xl object-cover" fetchpriority="high" loading="lazy" />
                          <div>
                            <p className="text-sm font-bold text-[#2D241E] dark:text-white leading-tight mb-1">{item.name}</p>
                            <p className={`text-xs ${THEME.muted}`}>{formatPrice(item.price)}</p>
                          </div>
                        </div>
                        {cartQty > 0 ? (
                          <div className="mt-auto w-full flex items-center justify-between bg-[#6F4E37] text-white rounded-lg px-2 py-1.5 min-h-[48px]">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const target = matchingCartItems[0];
                                if (target) updateQuantity(target.uniqueId, -1);
                              }}
                              className="p-1.5 hover:bg-white/20 rounded-md transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                            >
                              <Minus size={16} strokeWidth={2.5}/>
                            </button>
                            <span className="text-base font-bold w-6 text-center">{cartQty}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(item, item.variants?.[0] || null, item.description, null, '', item.prepOptions?.[0] || '');
                              }}
                              className="p-1.5 hover:bg-white/20 rounded-md transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                            >
                              <Plus size={16} strokeWidth={2.5}/>
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => addToCart(item, item.variants?.[0] || null, item.description, null, '', item.prepOptions?.[0] || '')} className="mt-auto w-full py-3 min-h-[48px] rounded-lg text-sm font-bold border border-[#6F4E37] text-[#6F4E37] dark:text-[#D4B895] group-hover:bg-[#6F4E37] group-hover:text-white transition-colors">
                            Add to Cart
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            
            {recentlyViewed.length > 0 && (
              <div id="recently-viewed" className="pb-8 animate-fade-in border-b border-black/5 dark:border-white/5 scroll-mt-24">
                <h3 className="text-xl font-bold mb-4 text-[#2D241E] dark:text-white flex items-center gap-2">
                  <Clock size={20} className={THEME.primaryText}/> Recently Viewed
                </h3>
                <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar">
                  {recentlyViewed.map(id => {
                    const item = MENU_ITEMS.find(i => i.id === id);
                    if(!item) return null;
                    const matchingCartItems = cart.filter(cartItem => cartItem.id === item.id);
                    const cartQty = matchingCartItems.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
                    return (
                      <div key={`recent-${id}`} className={`relative shrink-0 w-56 flex flex-col gap-3 p-3 rounded-xl ${THEME.cardBg} border ${THEME.border} shadow-sm hover:shadow-md transition-shadow min-h-[150px]`}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveRecentlyViewed(id);
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-black/40 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                          title="Remove from recently viewed"
                        >
                          <Trash2 size={14} />
                        </button>

                        <div onClick={() => onQuickView(item)} className="flex items-center gap-3 cursor-pointer pr-8">
                          <img src={item.image} className="w-14 h-14 rounded-lg object-cover" fetchpriority="high" loading="lazy" />
                          <div>
                            <p className="text-sm font-bold truncate w-28 text-[#2D241E] dark:text-white">{item.name}</p>
                            <p className={`text-xs ${THEME.muted}`}>{formatPrice(item.price)}</p>
                          </div>
                        </div>

                        {cartQty > 0 ? (
                          <div className="mt-auto w-full flex items-center justify-between bg-[#6F4E37] text-white rounded-lg px-2 py-1.5 min-h-[44px]">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const target = matchingCartItems[0];
                                if (target) updateQuantity(target.uniqueId, -1);
                              }}
                              className="p-1 hover:bg-white/20 rounded-md transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                            >
                              <Minus size={14} strokeWidth={2.5}/>
                            </button>
                            <span className="text-sm font-bold w-6 text-center">{cartQty}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(item, item.variants?.[0] || null, item.description, null, '', item.prepOptions?.[0] || '');
                              }}
                              className="p-1 hover:bg-white/20 rounded-md transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                            >
                              <Plus size={14} strokeWidth={2.5}/>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(item, item.variants?.[0] || null, item.description, null, '', item.prepOptions?.[0] || '');
                            }}
                            className="mt-auto w-full py-2.5 min-h-[44px] rounded-lg text-sm font-bold border border-[#6F4E37] text-[#6F4E37] dark:text-[#D4B895] hover:bg-[#6F4E37] hover:text-white transition-colors"
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {filteredAndSortedMenu.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 pt-8">
            {filteredAndSortedMenu.map((item, index) => (
              <ProductCard 
                key={`${item.id}-${sortOrder}`} 
                item={item} 
                addToCart={addToCart} 
                updateQuantity={updateQuantity}
                cart={cart}
                toggleFavorite={toggleFavorite}
                favorites={favorites}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 mb-4 text-[#8A7B72]">
              <Search size={28} />
            </div>
            <p className={`text-xl font-semibold mb-2 text-[#2D241E] dark:text-white`}>No matching items found</p>
            <p className={`text-sm ${THEME.muted}`}>Try adjusting your search or filters.</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); setDietFilter('All'); setSortOrder('default'); }}
              className="mt-6 px-6 py-3 min-h-[48px] border border-[#6F4E37] text-[#6F4E37] dark:text-[#D4B895] rounded-full font-semibold hover:bg-[#6F4E37] hover:text-white transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

// ==========================================
// 5. CHECKOUT, ORDER TRACKING, HISTORY, & ADMIN
// ==========================================

const CheckoutModal = ({ isOpen, onClose, onBackToCart, cart, cartTotal, cartTax, appliedDiscount, availableCoupons, onRedeemCoupon, orderMode, tableNumber, onConfirm, addToCart, onQuickView }) => {
  const [couponCode, setCouponCode] = useState('');
  const [localDiscount, setLocalDiscount] = useState(0);
  const [showCoupons, setShowCoupons] = useState(false);
  const contentRef = useRef(null);

  // Sync initial discount if they already applied one in the Cart Drawer
  useEffect(() => {
    if (isOpen) {
      setLocalDiscount(appliedDiscount || 0);
      setCouponCode('');
      setShowCoupons(false);
      requestAnimationFrame(() => {
        if (contentRef.current) contentRef.current.scrollTop = 0;
      });
    }
  }, [isOpen, appliedDiscount]);

  const handleApplyCoupon = () => {
    const code = couponCode.toUpperCase();
    const matched = availableCoupons.find((coupon) => coupon.code === code && !coupon.used);
    if (!matched) {
      alert("Invalid or used coupon.");
      setLocalDiscount(0);
      return;
    }
    setLocalDiscount(matched.amount);
    onRedeemCoupon(matched.code);
  };

  const checkoutRecommendations = useMemo(() => {
    if (cart.length === 0) return [];
    const cartCategories = [...new Set(cart.map((item) => item.category))];
    const cartIds = cart.map((item) => item.id.toString());
    const candidates = [];

    CATEGORIES.filter((cat) => cat !== 'All').forEach((cat) => {
      const pick = MENU_ITEMS.find((item) => item.category === cat && !cartIds.includes(item.id.toString()));
      if (pick) candidates.push(pick);
    });

    const prioritized = candidates.filter((item) => !cartCategories.includes(item.category));
    const merged = [...prioritized, ...candidates.filter((item) => cartCategories.includes(item.category))];
    return merged.slice(0, 4);
  }, [cart]);

  if (!isOpen) return null;
  
  const finalTotal = Math.max(0, cartTotal - localDiscount) + cartTax;
  
  // 🔥 REWARD PROGRESS BAR LOGIC (Calculated dynamically on Final Total)
  const earnedRewards = Math.floor(finalTotal / 500);
  const nextMilestone = (earnedRewards + 1) * 500;
  const remaining = nextMilestone - finalTotal;
  const progress = (finalTotal % 500) / 500 * 100;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#FAF7F2]/90 dark:bg-[#12100E]/90 backdrop-blur-md animate-fade-in overflow-y-auto hide-scrollbar">
      <div className={`w-full max-w-2xl h-full max-h-[95vh] ${THEME.cardBg} rounded-3xl shadow-2xl border ${THEME.border} overflow-hidden flex flex-col`}>
          <div className="p-4 flex justify-end items-center sticky top-0 z-10 bg-transparent">
             <button onClick={onBackToCart} className="p-2 bg-black/5 dark:bg-white/5 rounded-full hover:bg-black/10 transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center" title="Back to cart"><X size={20} className="text-[#2D241E] dark:text-white"/></button>
          </div>

           <div ref={contentRef} className="p-6 md:p-8 pt-0 space-y-6 flex-1 overflow-y-auto hide-scrollbar">
             <div className="bg-black/5 dark:bg-white/5 p-5 rounded-2xl">
               <div className="flex justify-between items-start mb-4 border-b border-black/10 dark:border-white/10 pb-2">
                 <h3 className="font-bold text-[#2D241E] dark:text-white text-lg">Order Details</h3>
               </div>
               <div className="flex items-center gap-2 mb-4 bg-white dark:bg-[#1C1917] p-3 rounded-xl shadow-sm w-max">
                  {orderMode === 'Dine-In' ? <MapPin size={18} className="text-[#6F4E37]"/> : <Package size={18} className="text-[#6F4E37]"/>}
                  <span className="font-bold text-sm text-[#2D241E] dark:text-white">
                    {orderMode === 'Dine-In' ? `Dine-In • Table ${tableNumber}` : 'Takeaway Order'}
                  </span>
               </div>
               
               <div className="space-y-3">
                 {cart.map(item => (
                    <div key={item.uniqueId} className="flex justify-between items-start text-sm">
                       <div>
                         <span className="font-bold text-[#2D241E] dark:text-white">{item.quantity}x {item.name}</span>
                         {(item.variantName || item.prepOption) && <p className={`text-xs ${THEME.muted} mt-0.5`}>{item.variantName} {item.prepOption && `• ${item.prepOption}`}</p>}
                         
                         {item.isCombo && item.comboItems && (
                            <div className="mt-1 mb-1.5 flex flex-col gap-0.5 ml-1 border-l-2 border-[#6F4E37]/20 pl-2">
                              {item.comboItems.map((ci, idx) => (
                                <span key={idx} className={`text-[10px] ${THEME.muted} leading-tight truncate`}>• {ci.name}</span>
                              ))}
                            </div>
                         )}
                       </div>
                       <span className="font-bold text-[#2D241E] dark:text-white">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                 ))}
               </div>
             </div>

             <div className="space-y-3">
              
              {/* 🔥 APPLY COUPON FIELD ADDED HERE */}
              <div className="pt-2 pb-4 border-b border-black/10 dark:border-white/10">
                <h4 className="text-sm font-bold mb-3 flex items-center gap-2 text-[#2D241E] dark:text-white"><Tag size={16}/> Apply Coupon</h4>
                <div className="flex items-center gap-2 min-w-0">
                  <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder=" " className={`flex-1 min-w-0 px-3 py-2 rounded-xl border ${THEME.border} bg-transparent text-sm outline-none focus:border-[#6F4E37] text-[#2D241E] dark:text-white uppercase`} />
                  <button onClick={handleApplyCoupon} className={`w-[78px] shrink-0 px-3 py-2 min-h-[48px] rounded-xl font-bold text-sm bg-black/5 dark:bg-white/10 text-[#2D241E] dark:text-white hover:bg-black/10 dark:hover:bg-white/20 transition-colors`}>Apply</button>
                </div>
                <button onClick={() => setShowCoupons((prev) => !prev)} className="mt-2 text-xs font-bold text-[#6F4E37] dark:text-[#D4B895] hover:underline">
                  View Coupons
                </button>
                {showCoupons && (
                  <div className="mt-2 max-h-28 overflow-y-auto hide-scrollbar space-y-1">
                    {availableCoupons.length === 0 && <p className="text-xs text-[#8A7B72]">No coupons earned yet.</p>}
                    {availableCoupons.map((coupon) => (
                      <button
                        key={coupon.code}
                        disabled={coupon.used}
                        onClick={() => setCouponCode(coupon.code)}
                        className={`w-full text-left px-2 py-1 rounded-md text-xs border ${coupon.used ? 'opacity-50 cursor-not-allowed border-black/10 dark:border-white/10' : 'border-[#6F4E37]/30 hover:bg-[#6F4E37]/10'}`}
                      >
                        <span className="font-bold">{coupon.code}</span> • Save {formatPrice(coupon.amount)} {coupon.used ? '(Used)' : ''}
                      </button>
                    ))}
                  </div>
                )}
                {localDiscount > 0 && <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Coupon applied successfully!</p>}
              </div>

              {checkoutRecommendations.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-sm font-bold mb-3 text-[#2D241E] dark:text-white">Recommended For You</h4>
                  <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar -mx-1 px-1 snap-x snap-mandatory">
                    {checkoutRecommendations.map((item) => (
                      <div key={`checkout-reco-${item.id}`} onClick={() => onQuickView(item)} className="cursor-pointer snap-start shrink-0 w-[220px] sm:w-[240px] flex items-center gap-3 p-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover shrink-0" loading="lazy" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold leading-tight text-[#2D241E] dark:text-white truncate">{item.name}</p>
                          <p className="text-[12px] text-[#8A7B72] dark:text-[#A89F95] mt-0.5">{formatPrice(item.price)}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item, item.variants?.[0] || null, item.description, null, '', item.prepOptions?.[0] || '');
                          }}
                          className="px-3 py-1.5 text-[11px] font-bold rounded-md border border-[#6F4E37]/40 text-[#6F4E37] dark:text-[#D4B895] hover:bg-[#6F4E37]/10 shrink-0"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 🔥 PROGRESS BAR */}
              <div className="bg-[#FAF7F2] dark:bg-[#1C1917] border border-[#D4B895]/50 p-4 rounded-2xl mt-2 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-[#2D241E] dark:text-white flex items-center gap-1">
                    <Trophy size={14} className="text-[#D4B895]"/> 
                    {earnedRewards > 0 ? `${earnedRewards} Reward(s) Unlocked! 🎉` : 'Mystery Reward'}
                  </span>
                  <span className="text-[10px] font-black text-[#6F4E37] dark:text-[#D4B895]">₹{finalTotal} / ₹{nextMilestone}</span>
                </div>
                <div className="h-2 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#6F4E37] dark:bg-[#D4B895] transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-[10px] mt-2 text-[#8A7B72] font-medium text-center">
                  Add <span className="font-bold text-[#2D241E] dark:text-white">₹{remaining}</span> more on this order to unlock another Reward
                </p>
              </div>

              <button onClick={onClose} className="w-full py-3 mt-2 rounded-xl font-bold text-[#6F4E37] dark:text-[#D4B895] bg-[#6F4E37]/10 dark:bg-[#D4B895]/10 hover:bg-[#6F4E37]/20 transition-colors min-h-[48px]">
                Add More Items
              </button>

              <div className="flex justify-between text-sm pt-2">
                <span className={THEME.muted}>Subtotal</span>
                <span className="font-medium text-[#2D241E] dark:text-white">{formatPrice(cartTotal)}</span>
              </div>
              {localDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400 font-bold">
                  <span>Discount</span>
                  <span>-{formatPrice(localDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className={THEME.muted}>Taxes & Fees</span>
                <span className="font-medium text-[#2D241E] dark:text-white">{formatPrice(cartTax)}</span>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-black/10 dark:border-white/10">
                <span className="font-bold text-xl text-[#2D241E] dark:text-white">Total Amount</span>
                <span className="font-black text-2xl text-[#6F4E37] dark:text-[#D4B895]">{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/10 dark:border-white/10">
             {/* Pass the updated local discount back to App.js */}
             <button onClick={() => onConfirm(localDiscount)} className={`w-full py-4 min-h-[56px] rounded-xl font-bold text-xl flex items-center justify-center gap-3 transition-transform shadow-xl ${THEME.primary} hover:scale-[1.02] active:scale-95`}>
               Place Order Now <ArrowRight size={22} strokeWidth={3}/>
             </button>
          </div>
       </div>
    </div>
  );
}
const OrderStatusScreen = ({ activeOrders, onClose }) => {
  const [now, setNow] = useState(Date.now());

  // Force a re-render every 10 seconds to update all order timers simultaneously
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(interval);
  }, []);

  if (!activeOrders || activeOrders.length === 0) {
    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#FAF7F2]/90 dark:bg-[#12100E]/90 backdrop-blur-md animate-fade-in overflow-y-auto">
        <div className={`max-w-md w-full text-center py-8 px-6 rounded-3xl shadow-2xl border ${THEME.border} ${THEME.cardBg} relative`}>
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/5 dark:bg-white/5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors z-10"><X size={20} className="text-[#2D241E] dark:text-white"/></button>
          <h2 className="text-2xl font-black text-[#2D241E] dark:text-white mb-3 mt-2">Track Your Orders</h2>
          <p className="text-sm text-[#8A7B72] mb-6">No active orders right now.</p>
          <button onClick={onClose} className={`w-full py-4 min-h-[56px] rounded-xl font-bold text-lg transition-transform hover:scale-[1.02] active:scale-95 shadow-xl ${THEME.primary}`}>
            Continue Ordering
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { label: 'Accepted', icon: <CheckCircle2 size={16} /> },
    { label: 'Preparing', icon: <Flame size={16} /> },
    { label: 'Ready', icon: <Utensils size={16} /> },
    { label: 'Served', icon: <CheckCircle2 size={16} /> }
  ];
  
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#FAF7F2]/90 dark:bg-[#12100E]/90 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className={`max-w-lg w-full text-center py-8 px-4 sm:px-8 rounded-3xl shadow-2xl border ${THEME.border} ${THEME.cardBg} relative max-h-[90vh] flex flex-col`}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/5 dark:bg-white/5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors z-10"><X size={20} className="text-[#2D241E] dark:text-white"/></button>

        <h2 className="text-2xl font-black text-[#2D241E] dark:text-white mb-6 mt-2">Track Your Orders</h2>

        {/* Scrollable list of all active orders */}
        <div className="overflow-y-auto hide-scrollbar flex-1 space-y-6 pb-4 text-left">
          {activeOrders.map(order => {
            const isRejected = order.status === 'Rejected';
            const statuses = ['Pending', 'Accepted', 'Preparing', 'Ready', 'Served'];
            let trackingStep = statuses.indexOf(order.status);
            if (trackingStep === -1 || trackingStep === 0) trackingStep = 0;

            const elapsed = (now - order.timestamp) / 60000;
            const timeLeft = Math.max(0, Math.ceil(order.estimatedDelivery - elapsed));

            return (
              <div key={order.id} className="bg-black/[0.03] dark:bg-white/[0.03] rounded-2xl p-5 border border-black/5 dark:border-white/5 relative overflow-hidden">
                {isRejected ? (
                   <div className="text-center">
                      <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-red-100 text-red-600 mb-4">
                         <X size={32} strokeWidth={2.5} />
                      </div>
                      <h3 className="text-xl font-black text-[#2D241E] dark:text-white mb-2">Order #{order.id} Declined</h3>
                      <p className="text-sm text-[#8A7B72]">Unfortunately, this order could not be processed.</p>
                   </div>
                ) : (
                   <>
                      <div className="flex justify-between items-center mb-6">
                         <h3 className="text-lg font-black text-[#2D241E] dark:text-white">Order #{order.id}</h3>
                         {trackingStep < 3 && trackingStep > 0 ? (
                           <span className="text-xs font-bold text-[#6F4E37] dark:text-[#D4B895] bg-[#6F4E37]/10 dark:bg-[#D4B895]/10 px-3 py-1.5 rounded-full">
                             ~{timeLeft} mins
                           </span>
                         ) : trackingStep >= 3 ? (
                           <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-3 py-1.5 rounded-full">
                             {trackingStep === 4 ? 'Complete! 🎉' : 'Ready! 🎉'}
                           </span>
                         ) : (
                           <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-3 py-1.5 rounded-full animate-pulse">Pending</span>
                         )}
                      </div>

                      {order.status !== 'Pending' && (
                        <div className="py-2 w-full mb-6">
                          <div className="flex items-center justify-between relative w-full px-2 sm:px-4">
                            <div className="absolute left-[10%] right-[10%] top-[16px] h-1 bg-black/10 dark:bg-white/10 rounded-full -z-10"></div>
                            <div className="absolute left-[10%] top-[16px] h-1 bg-green-500 rounded-full transition-all duration-700 ease-out -z-10" style={{ width: `${(Math.max(0, trackingStep - 1) / 3) * 80}%` }}></div>
                            
                            {steps.map((step, idx) => {
                              const isCompleted = trackingStep > idx;
                              const isCurrent = trackingStep === idx + 1;
                              return (
                                  <div key={idx} className="flex flex-col items-center gap-2 relative z-10 w-12">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted || isCurrent ? 'bg-green-500 text-white shadow-md scale-110' : 'bg-white dark:bg-[#1C1917] border border-black/10 dark:border-white/10 text-gray-400'}`}>
                                      {step.icon}
                                    </div>
                                    <span className={`text-[9px] font-bold transition-colors ${isCurrent ? 'text-[#6F4E37] dark:text-[#D4B895]' : isCompleted ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                                      {step.label}
                                    </span>
                                  </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2 border-t border-black/5 dark:border-white/5 pt-4">
                         {order.items.map(item => (
                            <div key={item.uniqueId} className="flex justify-between text-xs">
                               <span className="font-semibold text-[#2D241E] dark:text-white">{item.quantity}x {item.name}</span>
                               <span className="font-bold text-[#2D241E] dark:text-white">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                         ))}
                      </div>
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-black/5 dark:border-white/5">
                        <span className="text-xs font-bold text-[#8A7B72]">Total</span>
                        <span className="text-sm font-black text-[#6F4E37] dark:text-[#D4B895]">{formatPrice(order.total)}</span>
                      </div>
                   </>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-4 mt-auto border-t border-black/5 dark:border-white/5">
          <button onClick={onClose} className={`w-full py-4 min-h-[56px] rounded-xl font-bold text-lg transition-transform hover:scale-[1.02] active:scale-95 shadow-xl ${THEME.primary}`}>
            Continue Ordering
          </button>
        </div>
      </div>
    </div>
  );
};
const OrderHistoryModal = ({ isOpen, onClose, history, onReorder }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#FAF7F2] dark:bg-[#12100E] p-4 sm:p-6 animate-fade-in">
      <div className={`relative w-full max-w-5xl h-full max-h-[95vh] overflow-hidden ${THEME.cardBg} rounded-3xl shadow-2xl p-6 md:p-10 flex flex-col`}>
        <div className="flex justify-between items-center mb-4 border-b border-black/10 dark:border-white/10 pb-4 sticky top-0 bg-white dark:bg-[#1C1917] z-20 py-4">
          <h2 className="text-3xl font-black text-[#2D241E] dark:text-white flex items-center gap-3"><History size={32} className="text-[#6F4E37]"/> Order History</h2>
          <button onClick={onClose} className="p-2 bg-black/5 dark:bg-white/5 rounded-full hover:bg-black/10 transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center">
             <X size={24} className="text-[#2D241E] dark:text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar pr-1">

        {history.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20 opacity-50">
             <Package size={64} className="mb-4 text-[#2D241E] dark:text-white" />
             <p className={`text-xl font-bold text-[#2D241E] dark:text-white`}>No past orders found.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {history.map(order => (
              <div key={order.id} className={`p-6 rounded-2xl border ${THEME.border} ${THEME.cardBg} shadow-sm flex flex-col justify-between`}>
                <div>
                  <div className="flex justify-between items-start mb-4 border-b border-black/5 dark:border-white/5 pb-3">
                    <div>
                      <h3 className="text-xl font-black text-[#2D241E] dark:text-white flex items-center gap-3">
                        Order #{order.id}
                      </h3>
                      <p className={`text-sm ${THEME.muted}`}>{new Date(order.timestamp).toLocaleString()}</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="mb-6 space-y-2">
                    {order.items.map(i => (
                      <div key={i.uniqueId} className="flex items-start justify-between">
                        <div>
                          <p className={`font-semibold text-sm text-[#2D241E] dark:text-white`}>{i.quantity}x {i.name}</p>
                          {(i.variantName || i.prepOption) && <p className="text-[10px] text-[#8A7B72]">
                            {i.variantName} {i.prepOption && `• ${i.prepOption}`}
                          </p>}
                          
                          {i.isCombo && i.comboItems && (
                            <div className="mt-1 mb-1 flex flex-col gap-0.5 ml-1 border-l-2 border-[#6F4E37]/20 pl-2">
                              {i.comboItems.map((ci, idx) => (
                                <span key={idx} className={`text-[11px] text-[#8A7B72] leading-tight truncate`}>• {ci.name}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5 mt-auto">
                  <span className="font-black text-2xl text-[#2D241E] dark:text-white">{formatPrice(order.total)}</span>
                  <button onClick={() => { onClose(); onReorder(order); }} className={`px-6 py-3 min-h-[48px] rounded-xl font-bold text-sm transition-transform hover:scale-105 active:scale-95 ${THEME.primary} flex items-center gap-2`}>
                    <RefreshCcw size={16}/> Order Again
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

const FavoritesPage = ({ favorites, cart, isFavOpen, onClose, onViewCart, addToCart, updateQuantity, toggleFavorite }) => {
  if (!isFavOpen) return null;
  const favoriteItems = MENU_ITEMS.filter(item => favorites.includes(item.id));

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#FAF7F2] dark:bg-[#12100E] p-4 sm:p-6 animate-fade-in">
      <div className={`relative w-full max-w-5xl h-full max-h-[95vh] overflow-hidden ${THEME.cardBg} rounded-3xl shadow-2xl p-6 md:p-10 flex flex-col`}>
        <div className="flex justify-between items-center mb-4 border-b border-black/10 dark:border-white/10 pb-4 sticky top-0 bg-white dark:bg-[#1C1917] z-20 py-4">
          <h2 className="text-3xl font-black text-[#2D241E] dark:text-white flex items-center gap-3"><Heart size={32} className="text-red-500 fill-red-500"/> Your Favorites</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onViewCart}
              className="px-4 py-2 min-h-[44px] rounded-full bg-[#6F4E37] text-white font-bold text-sm hover:bg-[#5A3E2B] transition-colors"
            >
              View Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)})
            </button>
            <button onClick={onClose} className="p-2 bg-black/5 dark:bg-white/5 rounded-full hover:bg-black/10 transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center">
               <X size={24} className="text-[#2D241E] dark:text-white" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar pr-1">

        {favoriteItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
             <Heart size={64} className="mb-4 text-[#2D241E] dark:text-white" />
             <p className={`text-xl font-bold text-[#2D241E] dark:text-white`}>No favorites yet.</p>
             <button onClick={onClose} className="text-[#6F4E37] dark:text-[#D4B895] font-semibold hover:underline mt-2 min-h-[48px] px-4 py-2">
               Browse Menu
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {favoriteItems.map(item => (
              <div key={`fav-${item.id}`} className={`relative flex flex-col p-4 rounded-2xl border ${THEME.border} ${THEME.cardBg} shadow-sm group hover:shadow-lg transition-all w-full`}>
                <button onClick={() => toggleFavorite(item.id)} className={`absolute top-3 right-3 p-2 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors z-10 min-h-[40px] min-w-[40px] flex items-center justify-center`} title="Remove Favorite">
                   <Trash2 size={16} />
                </button>
                <div className="flex gap-4 mb-4">
                  <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover shadow-sm group-hover:scale-[1.02] transition-transform" fetchpriority="high" loading="lazy" />
                  <div className="flex flex-col justify-center flex-1 pr-8">
                    <div>
                      <h4 className="font-bold text-lg leading-tight text-[#2D241E] dark:text-white">{item.name}</h4>
                      <p className={`text-sm font-semibold ${THEME.primaryText} mt-1`}>{formatPrice(item.price)}</p>
                    </div>
                  </div>
                </div>
                {(() => {
                  const matchingCartItems = cart.filter(cartItem => cartItem.id === item.id);
                  const cartQty = matchingCartItems.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
                  return cartQty > 0 ? (
                    <div className="w-full mt-auto flex items-center justify-between bg-[#6F4E37] text-white rounded-xl px-2 py-1.5 shadow-md min-h-[48px]">
                      <button
                        onClick={() => {
                          const target = matchingCartItems[0];
                          if (target) updateQuantity(target.uniqueId, -1);
                        }}
                        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                      >
                        <Minus size={16} strokeWidth={2.5}/>
                      </button>
                      <span className="text-base font-bold w-6 text-center">{cartQty}</span>
                      <button
                        onClick={() => addToCart(item, item.variants?.[0] || null, item.description, null, '', item.prepOptions?.[0] || '')}
                        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                      >
                        <Plus size={16} strokeWidth={2.5}/>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item, item.variants?.[0] || null, item.description, null, '', item.prepOptions?.[0] || '')}
                      className="w-full py-3 min-h-[48px] mt-auto rounded-xl font-bold border-2 border-[#6F4E37] text-[#6F4E37] dark:border-[#D4B895] dark:text-[#D4B895] hover:bg-[#6F4E37] dark:hover:bg-[#D4B895] hover:text-white dark:hover:text-[#12100E] transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={16}/> Add to Cart
                    </button>
                  );
                })()}
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

const ResetConfirmModal = ({ isOpen, onClose, onReset }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#00000080] p-4 animate-fade-in">
      <div className={`relative w-full max-w-md rounded-3xl ${THEME.cardBg} shadow-2xl p-6`}> 
        <div className="mb-4">
          <h2 className="text-2xl font-black text-[#2D241E] dark:text-white">Reset All Data</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#8A7B72]">Rest all the data - Your Order Histry , Cart items , payments will be reset</p>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-black/10 dark:border-white/10 font-bold text-[#2D241E] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Back</button>
          <button onClick={onReset} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors">Reset</button>
        </div>
      </div>
    </div>
  );
};

const AdminLoginModal = ({ isOpen, onClose, onLogin }) => {
  const [pwd, setPwd] = useState('');
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if(pwd === 'admin123') { onLogin(); setPwd(''); }
    else alert('Incorrect Password. (Hint: admin123)');
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <form onSubmit={handleSubmit} className={`w-full max-w-sm ${THEME.cardBg} p-8 rounded-3xl shadow-2xl space-y-6 relative`}>
        <button type="button" onClick={onClose} className="absolute top-4 right-4 p-2 text-[#2D241E] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-full min-h-[48px] min-w-[48px] flex items-center justify-center"><X size={20}/></button>
        <div className="text-center">
          <div className="w-16 h-16 bg-[#6F4E37]/10 text-[#6F4E37] rounded-full flex items-center justify-center mx-auto mb-4"><Lock size={32}/></div>
          <h2 className="text-2xl font-black text-[#2D241E] dark:text-white">Admin Login</h2>
        </div>
        <input type="password" placeholder="Password" value={pwd} onChange={(e) => setPwd(e.target.value)} autoFocus className={`w-full p-4 rounded-xl border ${THEME.border} bg-transparent outline-none focus:border-[#6F4E37] text-[#2D241E] dark:text-white text-center text-lg`} />
        <button type="submit" className={`w-full py-4 min-h-[56px] rounded-xl font-bold text-lg transition-transform hover:scale-105 active:scale-95 ${THEME.primary}`}>Access Portal</button>
      </form>
    </div>
  );
}

const AdminPanel = ({ orders, onAcceptOrder, onRejectOrder, isOpen, onClose }) => {
  if (!isOpen) return null;

  const pendingCount = orders.filter((order) => order.status === 'Pending').length;
  const acceptedCount = orders.filter((order) => order.status === 'Accepted').length;
  const preparingCount = orders.filter((order) => order.status === 'Preparing').length;
  const readyCount = orders.filter((order) => order.status === 'Ready').length;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 animate-fade-in bg-[#FAF7F2] dark:bg-[#12100E]">
      <div className={`relative w-full max-w-5xl h-full max-h-[95vh] overflow-y-auto ${THEME.cardBg} rounded-3xl shadow-2xl p-6 md:p-10 hide-scrollbar`}>
        <div className="mb-8 border-b border-black/10 dark:border-white/10 pb-4 sticky top-0 bg-white/95 dark:bg-[#1C1917]/95 z-30 py-4 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#2D241E] dark:text-white flex items-center gap-3 leading-tight"><Utensils size={30} className="text-[#6F4E37]"/> Kitchen Dashboard</h2>
            <button onClick={onClose} className="w-full sm:w-auto justify-center px-5 py-2 min-h-[48px] bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full hover:bg-red-200 transition-colors font-bold text-sm flex items-center gap-2">
             <Lock size={14}/> Exit & Lock
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-xl px-3 py-2 text-xs font-bold flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1"><Clock size={13} /> Pending</span>
              <span>{pendingCount}</span>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl px-3 py-2 text-xs font-bold flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1"><CheckCircle2 size={13} /> Accepted</span>
              <span>{acceptedCount}</span>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-xl px-3 py-2 text-xs font-bold flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1"><Flame size={13} /> Preparing</span>
              <span>{preparingCount}</span>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-xl px-3 py-2 text-xs font-bold flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1"><Utensils size={13} /> Ready</span>
              <span>{readyCount}</span>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20 opacity-50">
             <Coffee size={64} className="mb-4 text-[#2D241E] dark:text-white" />
             <p className={`text-xl font-bold text-[#2D241E] dark:text-white`}>No Active Orders</p>
           </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className={`overflow-hidden p-5 sm:p-6 rounded-2xl border-2 ${order.status === 'Pending' ? 'border-[#6F4E37]' : THEME.border} ${THEME.cardBg} shadow-sm`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-black text-[#2D241E] dark:text-white flex flex-wrap items-center gap-2 sm:gap-3 leading-tight">
                      Order #{order.id}
                      {order.mode === 'Dine-In' && order.table && <span className="bg-[#6F4E37] text-white text-xs px-2 py-1 rounded-md inline-flex items-center gap-1 whitespace-nowrap"><MapPin size={12}/> Table {order.table}</span>}
                      {order.mode === 'Takeaway' && <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-md inline-flex items-center gap-1 whitespace-nowrap"><Package size={12}/> Takeaway</span>}
                    </h3>
                    <p className={`text-sm ${THEME.muted}`}>{new Date(order.timestamp).toLocaleTimeString()}</p>
                  </div>
                  <span className={`self-start sm:self-auto px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap ${order.status === 'Rejected' ? 'bg-red-100 text-red-700' : order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 animate-pulse' : order.status === 'Ready' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="mb-4 space-y-2 bg-black/5 dark:bg-white/5 p-4 rounded-xl">
                  {order.items.map(i => (
                    <div key={i.uniqueId} className="flex items-start justify-between border-b border-black/5 dark:border-white/5 pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className={`font-bold text-[#2D241E] dark:text-white`}>{i.quantity}x {i.name}</p>
                        <p className="text-xs text-[#8A7B72]">
                          {i.variantName ? `${i.variantName}` : ''} 
                          {i.prepOption ? ` • ${i.prepOption}` : ''}
                        </p>
                        
                        {i.isCombo && i.comboItems && (
                          <div className="mt-1 mb-1 ml-1 border-l-2 border-[#6F4E37]/20 pl-2 flex flex-col gap-0.5">
                            {i.comboItems.map((ci, idx) => (
                              <span key={idx} className="text-[11px] text-[#8A7B72] leading-tight truncate">• {ci.name}</span>
                            ))}
                          </div>
                        )}

                        {i.customizations && Object.entries(i.customizations).map(([k, v]) => (
                          <span key={k} className="text-[10px] bg-white dark:bg-black/20 px-2 py-0.5 rounded-md mr-1 border border-black/5 dark:border-white/5">{v}</span>
                        ))}
                        {i.instructions && <p className="text-xs text-red-600 font-semibold mt-1">Note: {i.instructions}</p>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-black/5 dark:border-white/5">
                  <span className="font-black text-2xl text-[#2D241E] dark:text-white">{formatPrice(order.total)}</span>
                  {order.status === 'Pending' && (
                    <div className="w-full sm:w-auto flex gap-2 sm:justify-end">
                      <button onClick={() => onRejectOrder(order.id)} className={`flex-1 sm:flex-none px-6 py-3 min-h-[48px] rounded-xl font-bold text-sm transition-transform hover:scale-105 active:scale-95 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400`}>
                        Reject
                      </button>
                      <button onClick={() => onAcceptOrder(order.id)} className={`flex-1 sm:flex-none px-8 py-3 min-h-[48px] rounded-xl font-bold text-base transition-transform hover:scale-105 active:scale-95 ${THEME.primary} shadow-lg shadow-[#6F4E37]/30`}>
                        Accept
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


// 🔥 4. VIEW CART FLOATING BAR
const FloatingCartBar = ({ cartCount, cartTotal, onOpenCart }) => {
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    if (cartCount > 0) {
      setIsBouncing(false); 
      setTimeout(() => setIsBouncing(true), 10); 
      const timer = setTimeout(() => setIsBouncing(false), 600); 
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  if (cartCount === 0) return null;

  return (
    <div 
      className={`fixed bottom-6 left-0 right-0 mx-auto w-[90%] max-w-[320px] z-40 bg-[#6F4E37] text-white rounded-full py-2.5 px-4 flex justify-between items-center shadow-[0_10px_30px_rgba(111,78,55,0.4)] cursor-pointer transition-colors ${isBouncing ? 'animate-attention' : 'animate-slide-up'}`} 
      onClick={onOpenCart}
    >
      <div className="flex flex-col pl-2">
          <span className="font-bold text-sm leading-tight mb-0.5">{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
          <span className="text-[11px] opacity-90 font-medium tracking-wide">{formatPrice(cartTotal)}</span>
      </div>
      <button className="font-bold text-sm flex items-center gap-1 bg-white text-[#6F4E37] px-4 py-1.5 rounded-full active:scale-95 transition-transform shadow-sm">
        View Cart <ArrowRight size={14}/>
      </button>
    </div>
  );
};

// 🔥 2. PROGRESS BAR (CART DRAWER UPDATE)
// 🔥 2. PROGRESS BAR (CART DRAWER UPDATE)
const CartDrawer = ({ cart, cartTax, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal, onProceedToCheckout, addToCart, availableCoupons, onRedeemCoupon, onQuickView }) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [showCoupons, setShowCoupons] = useState(false);

  useEffect(() => {
    if(cart.length === 0) setAppliedDiscount(0);
    setShowCoupons(false);
  }, [cart.length]);

  const handleApplyCoupon = () => {
    const code = couponCode.toUpperCase();
    const matched = availableCoupons.find((coupon) => coupon.code === code && !coupon.used);
    if (!matched) {
      alert("Invalid or used coupon.");
      setAppliedDiscount(0);
      return;
    }
    setAppliedDiscount(matched.amount);
    onRedeemCoupon(matched.code);
  };

  const finalTotal = Math.max(0, (cartTotal || 0) - (appliedDiscount || 0)) + (cartTax || 0);

  // IMPROVED PROGRESS BAR LOGIC
  const earnedRewards = Math.floor(cartTotal / 500);
  const nextMilestone = (earnedRewards + 1) * 500;
  const remaining = nextMilestone - cartTotal;
  const progress = (cartTotal % 500) / 500 * 100;
  // 🔥 UPDATED: YOU MAY ALSO LIKE (STRICTLY DIFFERENT CATEGORIES)
  const recommendations = useMemo(() => {
    if (cart.length === 0) return [];
    
    // 1. Get categories currently in the cart
    const cartCategories = [...new Set(cart.map(item => item.category))];
    const cartIds = cart.map(item => item.id.toString());
    
    // 2. Find all categories NOT in the cart
    const availableCategories = CATEGORIES.filter(cat => cat !== 'All' && !cartCategories.includes(cat));
    
    // 3. Fallback to all categories if they somehow bought from every single category
    const targetCategories = availableCategories.length > 0 ? availableCategories : CATEGORIES.filter(cat => cat !== 'All');
    
    let candidates = [];
    
    // 4. Pick exactly ONE popular item from each different category
    targetCategories.forEach(cat => {
       const item = MENU_ITEMS.find(i => i.category === cat && !cartIds.includes(i.id.toString()) && i.isPopular);
       if (item) candidates.push(item);
    });
    
    // 5. If we have less than 4 recommendations, fill the gaps
    if (candidates.length < 4) {
       const extra = MENU_ITEMS.filter(i => !cartIds.includes(i.id.toString()) && !candidates.some(c => c.id === i.id)).slice(0, 4 - candidates.length);
       candidates = [...candidates, ...extra];
    }
    
    return candidates.slice(0, 4);
  }, [cart]);

  return (
    <>


      <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsCartOpen(false)} />
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[420px] ${THEME.cardBg} shadow-2xl z-[60] transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col overflow-x-hidden ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className={`px-6 py-5 border-b ${THEME.border} flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]`}>
          <h2 className="text-xl font-bold flex items-center gap-2 text-[#2D241E] dark:text-white">
            <ShoppingBag size={22} /> Cart
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors active:scale-95 text-[#2D241E] dark:text-white min-h-[48px] min-w-[48px] flex items-center justify-center">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6 hide-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
              <ShoppingBag size={64} strokeWidth={1} className="text-[#2D241E] dark:text-white" />
              <p className="text-lg font-medium text-[#2D241E] dark:text-white">Your cart is empty.</p>
              <button onClick={() => setIsCartOpen(false)} className="text-[#6F4E37] dark:text-[#D4B895] font-semibold hover:underline mt-2 min-h-[48px] px-4 py-2">
                Browse Menu
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.uniqueId} className="flex gap-4 items-center animate-fade-in w-full min-w-0">
                <img src={item.image} className="w-20 h-20 rounded-xl object-cover shadow-sm" fetchpriority="high" loading="lazy" />
                <div className="flex-1 min-w-0 overflow-hidden">
                  <h4 className="font-bold text-base leading-tight text-[#2D241E] dark:text-white truncate">{item.name}</h4>
                  
                  {item.isCombo && item.comboItems && (
                    <div className="mt-1 mb-1.5 flex flex-col gap-0.5 ml-1 border-l-2 border-[#6F4E37]/20 pl-2">
                      {item.comboItems.map((ci, idx) => (
                        <span key={idx} className={`text-[10px] ${THEME.muted} leading-tight truncate`}>• {ci.name}</span>
                      ))}
                    </div>
                  )}

                  {item.variantName && <p className={`text-[10px] ${THEME.primaryText} font-bold tracking-wide uppercase mb-0.5`}>{item.variantName}</p>}
                  {item.customizations && Object.entries(item.customizations).map(([k, v]) => (
                    <p key={k} className={`text-[9px] ${THEME.muted} leading-tight truncate`}>{k}: {v}</p>
                  ))}
                  {item.prepOption && <p className={`text-[9px] text-[#6F4E37] dark:text-[#D4B895] leading-tight truncate`}>Style: {item.prepOption}</p>}
                  <p className={`text-xs ${THEME.muted} mb-2 mt-1`}>{formatPrice(item.price)} each</p>
                  
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQuantity(item.uniqueId, -1)} className={`p-1.5 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-md border ${THEME.border} hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all text-[#2D241E] dark:text-white`}><Minus size={14} /></button>
                    <span className="text-sm font-bold w-6 text-center text-[#2D241E] dark:text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.uniqueId, 1)} className={`p-1.5 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-md border ${THEME.border} hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all text-[#2D241E] dark:text-white`}><Plus size={14} /></button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between h-20 py-1 shrink-0">
                  <button onClick={() => removeFromCart(item.uniqueId)} className={`${THEME.muted} hover:text-red-500 p-1 min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors active:scale-95`} title="Remove item"><Trash2 size={16} /></button>
                  <span className="font-bold text-lg text-[#2D241E] dark:text-white">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            ))
          )}

          {cart.length > 0 && (
            <>
              <div className="pt-6 border-t border-black/10 dark:border-white/10">
                <h4 className="text-sm font-bold mb-3 flex items-center gap-2 text-[#2D241E] dark:text-white"><Tag size={16}/> Apply Coupon</h4>
                <div className="flex items-center gap-2 min-w-0">
                  <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder=" " className={`flex-1 min-w-0 px-3 py-2 rounded-xl border ${THEME.border} bg-transparent text-sm outline-none focus:border-[#6F4E37] text-[#2D241E] dark:text-white uppercase`} />
                  <button onClick={handleApplyCoupon} className={`w-[78px] shrink-0 px-3 py-2 min-h-[48px] rounded-xl font-bold text-sm bg-black/5 dark:bg-white/10 text-[#2D241E] dark:text-white hover:bg-black/10 dark:hover:bg-white/20 transition-colors`}>Apply</button>
                </div>
                <button onClick={() => setShowCoupons((prev) => !prev)} className="mt-2 text-xs font-bold text-[#6F4E37] dark:text-[#D4B895] hover:underline">
                  View Coupons
                </button>
                {showCoupons && (
                  <div className="mt-2 max-h-28 overflow-y-auto hide-scrollbar space-y-1">
                    {availableCoupons.length === 0 && <p className="text-xs text-[#8A7B72]">No coupons earned yet.</p>}
                    {availableCoupons.map((coupon) => (
                      <button
                        key={coupon.code}
                        disabled={coupon.used}
                        onClick={() => setCouponCode(coupon.code)}
                        className={`w-full text-left px-2 py-1 rounded-md text-xs border ${coupon.used ? 'opacity-50 cursor-not-allowed border-black/10 dark:border-white/10' : 'border-[#6F4E37]/30 hover:bg-[#6F4E37]/10'}`}
                      >
                        <span className="font-bold">{coupon.code}</span> • Save {formatPrice(coupon.amount)} {coupon.used ? '(Used)' : ''}
                      </button>
                    ))}
                  </div>
                )}
                {appliedDiscount > 0 && <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Coupon applied successfully!</p>}
              </div>

              {recommendations.length > 0 && (
                <div className="pt-3">
                  <h4 className="text-sm font-bold mb-3 text-[#2D241E] dark:text-white">Recommended For You</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {recommendations.map((item) => (
                      <div
                        key={`cart-reco-${item.id}`}
                        onClick={() => onQuickView(item)}
                        className="cursor-pointer text-left flex items-center gap-2 p-2 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                      >
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md object-cover" loading="lazy" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold truncate text-[#2D241E] dark:text-white">{item.name}</p>
                          <p className="text-[11px] text-[#8A7B72] dark:text-[#A89F95]">{formatPrice(item.price)}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item, item.variants?.[0] || null, item.description, null, '', item.prepOptions?.[0] || '');
                          }}
                          className="px-2 py-1 text-[11px] font-bold rounded-md border border-[#6F4E37]/40 text-[#6F4E37] dark:text-[#D4B895] hover:bg-[#6F4E37]/10"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-[#FAF7F2] dark:bg-[#1C1917] border border-[#D4B895]/50 p-4 rounded-2xl mt-2 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-[#2D241E] dark:text-white">
                    {earnedRewards > 0 ? `🎁 ${earnedRewards} Reward(s) Unlocked!` : '🎁 Mystery Reward'}
                  </span>
                  <span className="text-[10px] font-black text-[#6F4E37] dark:text-[#D4B895]">₹{cartTotal} / ₹{nextMilestone}</span>
                </div>
                <div className="h-2 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#6F4E37] transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-[10px] mt-2 text-[#8A7B72] text-center">
                  Add <b>₹{remaining}</b> more on this order to unlock another Reward
                </p>
              </div>

              <button onClick={() => setIsCartOpen(false)} className="w-full py-3 min-h-[48px] rounded-xl font-bold text-sm bg-[#6F4E37]/10 text-[#6F4E37] dark:bg-[#D4B895]/10 dark:text-[#D4B895] hover:bg-[#6F4E37]/20 dark:hover:bg-[#D4B895]/20 transition-colors">
                + Add More Items
              </button>

              <div className="space-y-3 pb-2">
                <div className="flex justify-between text-sm">
                  <span className={THEME.muted}>Subtotal</span>
                  <span className="font-medium text-[#2D241E] dark:text-white">{formatPrice(cartTotal)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400 font-bold">
                    <span>Discount</span>
                    <span>-{formatPrice(appliedDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className={THEME.muted}>Taxes & Fees</span>
                  <span className="font-medium text-[#2D241E] dark:text-white">{formatPrice(cartTax)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-black/10 dark:border-white/10">
                  <span className="font-bold text-xl text-[#2D241E] dark:text-white">Total</span>
                  <span className="font-bold text-xl text-[#2D241E] dark:text-white">{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className={`p-6 border-t ${THEME.border} bg-black/[0.02] dark:bg-white/[0.02]`}>
            <button onClick={() => { setIsCartOpen(false); onProceedToCheckout(appliedDiscount); }} className={`w-full py-4 min-h-[56px] rounded-full font-bold text-xl flex items-center justify-center gap-3 transition-transform shadow-[0_10px_20px_rgba(111,78,55,0.3)] ${THEME.primary} hover:scale-[1.05] active:scale-95`}>
              Place Order <ArrowRight size={20} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

const OrderModeModal = ({ isOpen, onClose, currentMode, currentTable, onSave }) => {
  const [mode, setMode] = useState(currentMode || 'Takeaway');
  const [table, setTable] = useState(currentTable || '');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className={`${THEME.cardBg} p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl relative`}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/5 dark:bg-white/5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"><X size={20} className="text-[#2D241E] dark:text-white"/></button>
        <div className="w-16 h-16 bg-[#6F4E37]/10 text-[#6F4E37] dark:text-[#D4B895] rounded-full flex items-center justify-center mx-auto mb-6">
          <Utensils size={32} />
        </div>
        <h2 className="text-2xl font-bold text-[#2D241E] dark:text-white mb-2">Order Mode</h2>
        <p className={`${THEME.muted} mb-6 text-sm`}>How would you like to enjoy your order?</p>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button onClick={() => setMode('Takeaway')} className={`py-3 rounded-xl border-2 font-bold flex flex-col items-center gap-1 transition-colors min-h-[64px] ${mode === 'Takeaway' ? 'border-[#6F4E37] bg-[#6F4E37]/10 text-[#6F4E37] dark:border-[#D4B895] dark:text-[#D4B895] dark:bg-[#D4B895]/10' : `border-black/10 dark:border-white/10 text-[#2D241E] dark:text-white`}`}>
            <Package size={20}/> Takeaway
          </button>
          <button onClick={() => setMode('Dine-In')} className={`py-3 rounded-xl border-2 font-bold flex flex-col items-center gap-1 transition-colors min-h-[64px] ${mode === 'Dine-In' ? 'border-[#6F4E37] bg-[#6F4E37]/10 text-[#6F4E37] dark:border-[#D4B895] dark:text-[#D4B895] dark:bg-[#D4B895]/10' : `border-black/10 dark:border-white/10 text-[#2D241E] dark:text-white`}`}>
            <MapPin size={20}/> Dine-In
          </button>
        </div>

        {mode === 'Dine-In' && (
          <input autoFocus type="number" min="1" value={table} onChange={e => { let val = parseInt(e.target.value); if (val < 1) val = 1; setTable(isNaN(val) ? '' : val); }} onBlur={() => { if(table < 1) setTable(1); }} placeholder="Enter Table No." className={`w-full text-center text-lg font-bold p-3 border ${THEME.border} rounded-xl mb-6 outline-none focus:border-[#6F4E37] bg-transparent text-[#2D241E] dark:text-white min-h-[48px]`} />
        )}
        
        <button onClick={() => { if(mode === 'Dine-In' && (!table || table < 1)) return alert('Please enter a valid table number (Min 1).'); onSave(mode, mode === 'Dine-In' ? table : ''); onClose(); }} className={`w-full py-4 min-h-[56px] ${THEME.primary} rounded-xl font-bold text-lg hover:scale-105 active:scale-95 transition-transform`}>Save Preferences</button>
      </div>
    </div>
  )
};

// ==========================================
// 6. MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('brewbite_theme') === 'dark';
    return false;
  });
  
  const [orderMode, setOrderMode] = useState('Takeaway');
  const [tableNumber, setTableNumber] = useState('');
  const [isTableLocked, setIsTableLocked] = useState(false);
  const [isModeModalOpen, setIsModeModalOpen] = useState(false);

  // 🔥 5. QR TABLE AUTO-DETECTION (CRITICAL)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tableFromURL = params.get("table");

      if (tableFromURL) {
        setTableNumber(tableFromURL);
        setOrderMode("Dine-In");
        setIsTableLocked(true);
        localStorage.setItem('brewbite_table', tableFromURL);
        localStorage.setItem('brewbite_mode', 'Dine-In');
      } else {
        setOrderMode(localStorage.getItem('brewbite_mode') || 'Takeaway');
        setTableNumber(localStorage.getItem('brewbite_table') || '');
        if (!localStorage.getItem('brewbite_mode_set')) {
          setIsModeModalOpen(true);
          localStorage.setItem('brewbite_mode_set', 'true');
        }
      }
    }
  }, []);

  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== 'undefined') return JSON.parse(localStorage.getItem('brewbite_favs')) || [];
    return [];
  });

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    if (typeof window !== 'undefined') return (JSON.parse(localStorage.getItem('brewbite_recent')) || []).slice(0, 10);
    return [];
  });

  const [recentlyOrdered, setRecentlyOrdered] = useState(() => {
    if (typeof window !== 'undefined') return (JSON.parse(localStorage.getItem('brewbite_ordered')) || []).slice(0, 10);
    return [];
  });

  const [orderHistory, setOrderHistory] = useState(() => {
    if (typeof window !== 'undefined') return JSON.parse(localStorage.getItem('brewbite_history')) || [];
    return [];
  });
  
  useEffect(() => {
    localStorage.setItem('brewbite_history', JSON.stringify(orderHistory));
  }, [orderHistory]);

  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') return JSON.parse(localStorage.getItem('brewbite_cart')) || [];
    return [];
  });
  const [orders, setOrders] = useState(() => {
    if (typeof window !== 'undefined') return JSON.parse(localStorage.getItem('brewbite_orders')) || [];
    return [];
  }); 
  
  useEffect(() => {
    localStorage.setItem('brewbite_orders', JSON.stringify(orders));
  }, [orders]);
  
  const [isCartAnimating, setIsCartAnimating] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('brewbite_cart_open') === 'true';
    return false;
  });
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [pendingDiscount, setPendingDiscount] = useState(0);

  const [isFavOpen, setIsFavOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  const resetAppData = () => {
    setIsResetConfirmOpen(false);
    setCart([]);
    setOrders([]);
    setOrderHistory([]);
    setRecentlyOrdered([]);
    setRecentlyViewed([]);
    setFavorites([]);
    setPendingDiscount(0);
    setIsCartOpen(false);
    setIsCheckoutOpen(false);
    setIsBillModalOpen(false);
    setIsModeModalOpen(true);
    setOrderMode('Takeaway');
    setTableNumber('');
    setIsTableLocked(false);

    if (typeof window !== 'undefined') {
      localStorage.removeItem('brewbite_cart');
      localStorage.removeItem('brewbite_cart_open');
      localStorage.removeItem('brewbite_history');
      localStorage.removeItem('brewbite_ordered');
      localStorage.removeItem('brewbite_recent');
      localStorage.removeItem('brewbite_favs');
      localStorage.removeItem('brewbite_coupons');
      localStorage.removeItem('brewbite_mode');
      localStorage.removeItem('brewbite_table');
      localStorage.removeItem('brewbite_mode_set');
    }
  };

  const [quickViewItem, setQuickViewItem] = useState(null);
  const [dietFilter, setDietFilter] = useState('All');
  
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [unreadNotif, setUnreadNotif] = useState(0);
  const [toastState, setToastState] = useState({ visible: false, message: '' });

  // REWARD STATES
  const [earnedCoupons, setEarnedCoupons] = useState(() => {
    if (typeof window !== 'undefined') return JSON.parse(localStorage.getItem('brewbite_coupons')) || [];
    return [];
  });
  const [scratchQueue, setScratchQueue] = useState([]);
  const [showScratchCard, setShowScratchCard] = useState(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('brewbite_coupons', JSON.stringify(earnedCoupons));
  }, [earnedCoupons]);

  useEffect(() => {
    localStorage.setItem('brewbite_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
    if (!quickViewItem) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [quickViewItem]);

  useEffect(() => { localStorage.setItem('brewbite_favs', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem('brewbite_recent', JSON.stringify(recentlyViewed)); }, [recentlyViewed]);
  useEffect(() => { localStorage.setItem('brewbite_ordered', JSON.stringify(recentlyOrdered)); }, [recentlyOrdered]);
  useEffect(() => { localStorage.setItem('brewbite_history', JSON.stringify(orderHistory)); }, [orderHistory]);
  useEffect(() => { localStorage.setItem('brewbite_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('brewbite_cart_open', JSON.stringify(isCartOpen)); }, [isCartOpen]);
  useEffect(() => { 
    if(!isTableLocked) {
      localStorage.setItem('brewbite_mode', orderMode); 
      localStorage.setItem('brewbite_table', tableNumber);
    }
  }, [orderMode, tableNumber, isTableLocked]);

  useEffect(() => {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

useEffect(() => {
    const activeIntervals = orders.map(order => {
      const totalWaitMs = order.estimatedDelivery * 60 * 1000;
      const timeSpent = Date.now() - order.timestamp;

      if (order.status === 'Accepted') {
        return setTimeout(() => setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'Preparing' } : o)), 10000); // 10s to accept
      }
      if (order.status === 'Preparing') {
        const timeRemaining = Math.max(0, totalWaitMs - timeSpent);
        return setTimeout(() => setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'Ready' } : o)), timeRemaining);
      }
      if (order.status === 'Ready') {
        return setTimeout(() => setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'Served' } : o)), 5000);
      }
      return null;
    });
    return () => activeIntervals.forEach(timer => timer && clearTimeout(timer));
  }, [orders]);

  useEffect(() => {
    orders.forEach(order => {
      if (order.status === 'Ready' && !order.readyNotified) {
        setUnreadNotif(prev => prev + 1);
        showToast(`Your order #${order.id} is ready! 🔔`);
        try { new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play(); } catch(e){}
        setOrders(prev => prev.map(o => o.id === order.id ? { ...o, readyNotified: true } : o));
      }
    });
  }, [orders]);

  const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.price * item.quantity), 0), [cart]);
  const cartItemCount = useMemo(() => cart.reduce((count, item) => count + item.quantity, 0), [cart]);
  
  const cartTax = useMemo(() => cart.reduce((tax, item) => {
    const itemTax = (Number(item.id) % 5) + 1 || 2; 
    return tax + (itemTax * Number(item.quantity));
  }, 0), [cart]);
  
  const deliveryTime = useMemo(() => {
    let coffeeMins = 0;
    let foodMins = 0;
    cart.forEach(item => {
      if (item.category === 'Coffee' || item.category === 'Smoothies & Shakes') coffeeMins += 5;
      else foodMins += 12;
    });
    if (cart.length === 0) return 0;
    const totalEstimated = Math.max(5, Math.ceil(Math.max(coffeeMins, foodMins) * 0.8)); 
    return totalEstimated > 45 ? 45 : totalEstimated; 
  }, [cart]);

  const triggerCartAnimation = () => {
    setIsCartAnimating(true);
    setTimeout(() => setIsCartAnimating(false), 600); 
  };

  const showToast = (message) => {
    setToastState({ visible: true, message });
    setTimeout(() => setToastState({ visible: false, message: '' }), 2500);
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        showToast("Removed from Favorites 🤍");
        return prev.filter(fId => fId !== id);
      } else {
        showToast("Added to Favorites ❤️");
        return [...prev, id];
      }
    });
  };

// 🔥 UPDATED: EXACT "N" MINUTES ORDER PROGRESSION
  useEffect(() => {
    const activeIntervals = orders.map(order => {
      // Calculate total wait time in milliseconds (n minutes * 60 seconds * 1000 ms)
      const totalWaitMs = order.estimatedDelivery * 60 * 1000;
      const timeSpent = Date.now() - order.timestamp;

      if (order.status === 'Accepted') {
        // Move to 'Preparing' after a short 10-second delay for realism
        return setTimeout(() => setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'Preparing' } : o)), 10000);
      }
      if (order.status === 'Preparing') {
        // Move to 'Ready' ONLY when the exact 'n' minutes have passed since the order was placed
        const timeRemaining = Math.max(0, totalWaitMs - timeSpent);
        return setTimeout(() => setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'Ready' } : o)), timeRemaining);
      }
      if (order.status === 'Ready') {
        // Move to 'Served' 5 seconds after showing Ready
        return setTimeout(() => setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'Served' } : o)), 5000);
      }
      return null;
    });
    return () => activeIntervals.forEach(timer => timer && clearTimeout(timer));
  }, [orders]);
  const handleQuickView = (item) => {
    setQuickViewItem(item);
    setRecentlyViewed(prev => {
      const newRecent = [item.id, ...prev.filter(id => id !== item.id)].slice(0, 10);
      return newRecent;
    });
  };

  const addToCart = (product, variant = null, overrideDesc = null, customizations = null, instructions = '', prepOption = '') => {
    const cartItemId = variant ? `${product.id}-${variant.name}` : product.id.toString();
    const uniqueId = `${cartItemId}${customizations ? '-' + btoa(JSON.stringify(customizations)) : ''}${instructions ? '-instr' : ''}${prepOption ? '-' + prepOption : ''}`;
    
    setCart(prev => {
      const existing = prev.find(item => item.uniqueId === uniqueId);
      if (existing) {
        return prev.map(item => item.uniqueId === uniqueId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { 
        ...product, 
        cartItemId, 
        uniqueId,
        variantName: variant?.name, 
        desc: overrideDesc || product.description,
        price: variant ? variant.price : product.price, 
        quantity: 1,
        customizations,
        instructions,
        prepOption
      }];
    });
    triggerCartAnimation();
  
  };

  const updateQuantity = (uniqueId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.uniqueId === uniqueId) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (uniqueId) => setCart(prev => prev.filter(item => item.uniqueId !== uniqueId));

const handlePlaceOrder = (discountAmount) => {
    setIsCheckoutOpen(false);
    const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
    const finalTotal = Math.max(0, cartTotal - discountAmount) + cartTax;
    
    const rewardsCount = Math.floor(finalTotal / 500);
    if (rewardsCount > 0) {
      setScratchQueue(generateRewardCoupons(rewardsCount));
      setShowScratchCard(true);
    }

    const cartItemIds = cart.map(c => c.id);
    setRecentlyOrdered(prev => { const newRecents = [...new Set([...cartItemIds, ...prev])].slice(0, 10); return newRecents; });

    // 🔥 FIX: Added "earnedRewards: rewardsCount" so the order remembers it!
    const newOrder = { 
      id: orderId, 
      items: cart, 
      total: finalTotal, 
      status: 'Pending', 
      mode: orderMode, 
      table: tableNumber, 
      timestamp: Date.now(), 
      estimatedDelivery: deliveryTime,
      earnedRewards: rewardsCount 
    };
    
    setOrders(prev => [newOrder, ...prev]);
    setOrderHistory(prev => [newOrder, ...prev]); 
    setActiveOrderId(orderId);
    setUnreadNotif(prev => prev + 1);
    setIsStatusOpen(true);
    setCart([]); 
    setPendingDiscount(0);
  };

  const handleReorder = (pastOrder) => {
     pastOrder.items.forEach(item => {
        addToCart(item, item.variants?.find(v => v.name === item.variantName), item.desc, item.customizations, item.instructions, item.prepOption);
     });
     setIsCartOpen(true);
  }

  const handleAdminLoginSuccess = () => {
    setIsAdminLoginOpen(false);
    setIsAdminPanelOpen(true);
    showToast('Admin portal unlocked');
  };

  const handleRedeemCoupon = (code) => {
    setEarnedCoupons((prev) => prev.map((coupon) => (
      coupon.code === code ? { ...coupon, used: true, usedAt: Date.now() } : coupon
    )));
  };

  const handleClaimCoupon = (claimedCoupon) => {
    setEarnedCoupons((prev) => [...prev, claimedCoupon]);
  };

  const handleAcceptOrder = (orderId) => {
    setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: 'Accepted' } : order));
    setOrderHistory(prev => prev.map(order => order.id === orderId ? { ...order, status: 'Accepted' } : order));
  };

  const handleRejectOrder = (orderId) => {
    setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: 'Rejected' } : order));
    setOrderHistory(prev => prev.map(order => order.id === orderId ? { ...order, status: 'Rejected' } : order));
  };

  // Get ALL active orders for the current user's session
 // Get ALL active orders for the current user's session
  const myActiveOrders = orders.filter(o => 
    o.mode === orderMode && 
    o.table === tableNumber && 
    ['Pending', 'Accepted', 'Preparing', 'Ready', 'Served', 'Rejected'].includes(o.status)
  );

  const adminActiveOrders = useMemo(
    () => orders
      .filter(o => ['Pending', 'Accepted', 'Preparing', 'Ready'].includes(o.status))
      .sort((a, b) => b.timestamp - a.timestamp),
    [orders],
  );

  return (
    <>
      <div className={`w-full overflow-x-hidden min-h-screen transition-colors duration-300 ${THEME.bg} ${THEME.text}`} style={{ fontFamily: "'Poppins', sans-serif" }}>
        
        {/* SCRATCH CARD TRIGGER */}
        <ScratchCardModal
          isOpen={showScratchCard}
          onClose={() => {
            setShowScratchCard(false);
            setScratchQueue([]);
          }}
          rewardCoupons={scratchQueue}
          onClaimCoupon={handleClaimCoupon}
        />

        <OrderModeModal 
          isOpen={isModeModalOpen && !isTableLocked} 
          onClose={() => setIsModeModalOpen(false)} 
          currentMode={orderMode} 
          currentTable={tableNumber} 
          onSave={(m, t) => { setOrderMode(m); setTableNumber(t); showToast(`Mode updated to ${m}`); }} 
        />

        <Navbar 
          cartCount={cartItemCount} 
          setIsCartOpen={setIsCartOpen} 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
          isCartAnimating={isCartAnimating} 
          unreadNotif={unreadNotif}
          adminBadgeCount={adminActiveOrders.filter(o => o.status === 'Pending').length}
          onNotifClick={() => { setUnreadNotif(0); setIsStatusOpen(true); }}
          orderMode={orderMode}
          tableNumber={tableNumber}
          onModeChangeClick={() => setIsModeModalOpen(true)}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isTableLocked={isTableLocked}
          onAdminClick={() => setIsAdminLoginOpen(true)}
        />

        <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`fixed inset-y-0 right-0 w-[280px] sm:w-[320px] ${THEME.cardBg} shadow-2xl z-[200] transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
           <div className="p-6 border-b border-black/10 dark:border-white/10 flex justify-between items-center bg-black/[0.02] dark:bg-white/[0.02]">
             <span className="text-2xl font-bold text-[#2D241E] dark:text-white">Menu</span>
             <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-black/5 dark:bg-white/5 rounded-full min-h-[48px] min-w-[48px] flex items-center justify-center"><X size={20}/></button>
           </div>
           <div className="flex flex-col p-4 gap-2">
             {/* CHECKOUT ADDED TO HAMBURGER MENU */}
             <button onClick={() => { setIsBillModalOpen(true); setIsMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-[#6F4E37] text-white hover:bg-[#5A3E2B] transition-colors font-bold text-lg min-h-[48px] mb-2 shadow-lg">
                <CreditCard size={24} /> Secure Checkout
             </button>

             <button onClick={() => { setIsHistoryOpen(true); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-bold text-lg text-[#2D241E] dark:text-white min-h-[48px]"><History size={24} className="text-[#6F4E37] dark:text-[#D4B895]"/> Order History</button>
             <button onClick={() => { setIsFavOpen(true); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-bold text-lg text-[#2D241E] dark:text-white min-h-[48px]"><Heart size={24} className="text-[#6F4E37] dark:text-[#D4B895]"/> Favorites</button>
             <button onClick={() => { document.getElementById('recently-viewed')?.scrollIntoView({behavior:'smooth', block: 'start'}); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-bold text-lg text-[#2D241E] dark:text-white min-h-[48px]"><Clock size={24} className="text-[#6F4E37] dark:text-[#D4B895]"/> Recently Viewed</button>
             <button onClick={() => { document.getElementById('order-again')?.scrollIntoView({behavior:'smooth', block: 'start'}); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-bold text-lg text-[#2D241E] dark:text-white min-h-[48px]"><Package size={24} className="text-[#6F4E37] dark:text-[#D4B895]"/> Order Again</button>
             <button onClick={() => { setIsAdminLoginOpen(true); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-bold text-lg text-[#2D241E] dark:text-white min-h-[48px]"><Lock size={24} className="text-[#6F4E37] dark:text-[#D4B895]"/> Admin Portal</button>
             
             <div className="mt-auto border-t border-black/10 dark:border-white/10 pt-4 flex flex-col gap-4">
               <button onClick={() => { setIsResetConfirmOpen(true); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 p-4 rounded-2xl bg-red-300 text-red-900 dark:bg-red-700 dark:text-red-100 hover:bg-red-400 dark:hover:bg-red-600 transition-colors font-bold text-lg min-h-[48px]">
                  <Trash2 size={24}/> Reset App Data
               </button>
               <button onClick={() => { setIsDarkMode(!isDarkMode); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-lg text-[#2D241E] dark:text-white min-h-[48px]">
                  {isDarkMode ? <><Sun size={24}/> Light Mode</> : <><Moon size={24}/> Dark Mode</>}
               </button>
             </div>
           </div>
        </div>
        
        <Hero />
        
        <MenuBoard 
          cart={cart} 
          addToCart={addToCart} 
          updateQuantity={updateQuantity} 
          toggleFavorite={toggleFavorite}
          favorites={favorites}
          onQuickView={handleQuickView}
          onRemoveRecentlyViewed={(id) => setRecentlyViewed(prev => prev.filter(viewedId => viewedId !== id))}
          recentlyViewed={recentlyViewed}
          recentlyOrdered={recentlyOrdered}
          dietFilter={dietFilter}
          setDietFilter={setDietFilter}
        />

        <FloatingCartBar 
          cartCount={cartItemCount} 
          cartTotal={cartTotal}
          onOpenCart={() => setIsCartOpen(true)} 
        />

        <QuickViewModal 
          item={quickViewItem} 
          isOpen={!!quickViewItem} 
          onClose={() => setQuickViewItem(null)} 
          addToCart={addToCart} 
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />

        <CartDrawer 
          cart={cart} 
          cartTax={cartTax}
          isCartOpen={isCartOpen} 
          setIsCartOpen={setIsCartOpen} 
          updateQuantity={updateQuantity} 
          removeFromCart={removeFromCart} 
          cartTotal={cartTotal}
          onProceedToCheckout={(discount) => { setPendingDiscount(discount); setIsCheckoutOpen(true); }}
          addToCart={addToCart}
          availableCoupons={earnedCoupons}
          onRedeemCoupon={handleRedeemCoupon}
          onQuickView={(item) => {
            setIsCartOpen(false);
            handleQuickView(item);
          }}
        />
<CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onBackToCart={() => {
            setIsCheckoutOpen(false);
            setIsCartOpen(true);
          }}
          cart={cart}
          cartTotal={cartTotal}
          cartTax={cartTax}
          appliedDiscount={pendingDiscount}
          availableCoupons={earnedCoupons}
          onRedeemCoupon={handleRedeemCoupon}
          orderMode={orderMode}
          tableNumber={tableNumber}
          addToCart={addToCart}
          onQuickView={(item) => {
            setIsCheckoutOpen(false);
            handleQuickView(item);
          }}
          // 👇 Change this line exactly like this:
          onConfirm={(finalDiscount) => handlePlaceOrder(finalDiscount)} 
        />

        <BillSettlementModal 
          isOpen={isBillModalOpen} 
          onClose={() => setIsBillModalOpen(false)} 
          orders={orders} 
           onSettleBill={(selectedOrderIds) => {
             setOrders(prev => prev.map(o => selectedOrderIds.includes(o.id) ? { ...o, isPaid: true } : o));
             setOrderHistory(prev => prev.map(o => selectedOrderIds.includes(o.id) ? { ...o, isPaid: true } : o));
          }}
        />

        <FavoritesPage
          favorites={favorites}
          cart={cart}
          isFavOpen={isFavOpen}
          onClose={() => setIsFavOpen(false)}
          onViewCart={() => { setIsFavOpen(false); setIsCartOpen(true); }}
          addToCart={addToCart}
          updateQuantity={updateQuantity}
          toggleFavorite={toggleFavorite}
        />

        <OrderHistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          history={orderHistory}
          onReorder={handleReorder}
        />

       {isStatusOpen && (<OrderStatusScreen activeOrders={myActiveOrders} onClose={() => setIsStatusOpen(false)} />)}

        <ResetConfirmModal
          isOpen={isResetConfirmOpen}
          onClose={() => setIsResetConfirmOpen(false)}
          onReset={resetAppData}
        />

        <AdminLoginModal
          isOpen={isAdminLoginOpen}
          onClose={() => setIsAdminLoginOpen(false)}
          onLogin={handleAdminLoginSuccess}
        />

        <AdminPanel
          orders={adminActiveOrders}
          onAcceptOrder={handleAcceptOrder}
          onRejectOrder={handleRejectOrder}
          isOpen={isAdminPanelOpen}
          onClose={() => setIsAdminPanelOpen(false)}
        />

        <Toast message={toastState.message} visible={toastState.visible} />
      </div>


      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;900&display=swap');
        
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        
        body { 
          margin: 0; 
          padding: 0; 
          background-color: #FAF7F2; 
          transition: background-color 0.3s ease; 
          overflow-x: hidden;
        }
        
        html.dark body { background-color: #12100E; }

        .reveal-on-scroll { 
          opacity: 0; 
          transform: translateY(40px); 
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); 
        }
        .reveal-on-scroll.is-revealed { 
          opacity: 1; 
          transform: translateY(0); 
        }

        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { 0% { transform: scale(0.8); opacity: 0; } 50% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes attentionPulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(111, 78, 55, 0.7); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(111, 78, 55, 0); background-color: #5A3E2B; }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(111, 78, 55, 0); }
        }
        .animate-attention { animation: attentionPulse 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        
        @keyframes cartStrong {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(111, 78, 55, 0.7); background-color: transparent; }
          25% { transform: scale(1.3) rotate(-10deg); background-color: #6F4E37; color: white; }
          50% { transform: scale(1.4) rotate(10deg); background-color: #6F4E37; color: white; }
          75% { transform: scale(1.3) rotate(-10deg); background-color: #6F4E37; color: white; box-shadow: 0 0 0 15px rgba(111, 78, 55, 0); }
          100% { transform: scale(1) rotate(0); box-shadow: 0 0 0 0 rgba(111, 78, 55, 0); background-color: transparent; }
        }
        
        .animate-cart-strong { animation: cartStrong 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        .animate-pop-in { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-slide-down { animation: slideDown 0.3s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.4s ease-out forwards; }
        
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </>
  );
}