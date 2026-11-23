export const DINING_DATA = {
  restaurantName: "Hotel Rajmahal Palace Restaurant",
  subtitle: "Pure Veg Restaurant",
  tagline: "Authentic Maharashtra, North Indian & Pure Vegetarian Delicacies",
  orderPhone: "+91 70706 16464",
  orderPhoneRaw: "+917070616464",
  orderWhatsApp: "917070616464",
  timings: {
    breakfast: "7:00 AM – 11:00 AM",
    lunch: "12:00 PM – 4:00 PM",
    dinner: "7:00 PM – 11:00 PM",
  },
  categories: [
    { id: "all", name: "All Dishes", icon: "✨" },
    { id: "breakfast", name: "Breakfast", icon: "🥣" },
    { id: "sandwich", name: "Sandwich", icon: "🥪" },
    { id: "upvas", name: "Upvas Special", icon: "🙏" },
    { id: "soups", name: "Soups", icon: "🍲" },
    { id: "starters", name: "Starters", icon: "🥗" },
    { id: "main-course", name: "Veg Main Course", icon: "🥘" },
    { id: "paneer", name: "Paneer Special", icon: "🧀" },
    { id: "dal", name: "Dal", icon: "🍛" },
    { id: "rice", name: "Rice & Pulao", icon: "🍚" },
    { id: "sabji", name: "Veg Sabji", icon: "🥔" },
    { id: "roti", name: "Roti & Breads", icon: "🫓" },
    { id: "raita", name: "Raita & Curd", icon: "🥗" },
    { id: "sweets", name: "Sweets & Desserts", icon: "🍨" },
    { id: "hot-drinks", name: "Hot Drinks", icon: "☕" },
    { id: "cold-drinks", name: "Cold Drinks", icon: "🥤" },
    { id: "thali", name: "Thali", icon: "🍽️" },
  ],
  menu: [
    // 🥣 BREAKFAST
    { name: "Poha", price: "₹60", category: "breakfast", icon: "🥣", desc: "Fresh flattened rice tempered with mustard, curry leaves, onions & roasted peanuts" },
    { name: "Upma", price: "₹60", category: "breakfast", icon: "🥣", desc: "Traditional semolina breakfast tempered with ghee, ginger & fresh herbs" },
    { name: "Shira", price: "₹60", category: "breakfast", icon: "🥣", desc: "Warm semolina sweet pudding prepared with pure ghee & cardamom" },
    { name: "Batata Bhaji", price: "₹90", category: "breakfast", icon: "🥣", desc: "Spiced golden potato sabji cooked with green chillies & fresh coriander" },
    { name: "Kanda Bhaji", price: "₹90", category: "breakfast", icon: "🥣", desc: "Crispy Maharashtrian spiced onion fritters served piping hot" },
    { name: "Maggi (Plain / Masala / Peri Peri / Cheese)", price: "₹80", category: "breakfast", icon: "🥣", desc: "Cooked to your preference: Classic Plain, Masala, Peri Peri, or Cheese Loaded" },
    { name: "Vada Pav", price: "₹20", category: "breakfast", icon: "🥣", desc: "Iconic spiced potato fritter in fresh pav with garlic chutney" },
    { name: "Misal Pav", price: "₹100", category: "breakfast", icon: "🥣", desc: "Spicy sprouted moth bean curry with farsan, onions, lemon & butter pav" },

    // 🥪 SANDWICH
    { name: "Veg Sandwich", price: "₹70", category: "sandwich", icon: "🥪", desc: "Fresh cucumbers, tomatoes, potatoes & green mint chutney" },
    { name: "Grill Sandwich", price: "₹90", category: "sandwich", icon: "🥪", desc: "Golden toasted sandwich with vegetables, butter & signature spices" },
    { name: "Bread Butter", price: "₹60", category: "sandwich", icon: "🥪", desc: "Soft slices served with generous premium table butter" },
    { name: "Bread Jam", price: "₹70", category: "sandwich", icon: "🥪", desc: "Classic toasted bread slices with mixed fruit preserve" },

    // 🙏 UPVAS SPECIAL
    { name: "Sabudana Vada", price: "₹80", category: "upvas", icon: "🙏", desc: "Crispy fasting tapioca pearl patties blended with roasted peanuts & potatoes" },
    { name: "Sabudana Khichadi", price: "₹100", category: "upvas", icon: "🙏", desc: "Soft non-sticky sabudana sautéed in pure ghee with crushed peanuts & cumin" },
    { name: "Finger Chips", price: "₹80", category: "upvas", icon: "🙏", desc: "Crisp golden potato fries lightly salted with rock salt" },

    // 🍲 SOUPS
    { name: "Veg Manchow Soup", price: "₹90", category: "soups", icon: "🍲", desc: "Spicy Indo-Chinese broth loaded with diced vegetables & fried noodles" },
    { name: "Veg Sweet Corn Soup", price: "₹120", category: "soups", icon: "🍲", desc: "Velvety broth of tender sweet corn kernels and farm-fresh vegetables" },
    { name: "Veg Mushroom Soup", price: "₹150", category: "soups", icon: "🍲", desc: "Rich and creamy soup prepared with fresh button mushrooms and garlic" },

    // 🥗 STARTERS
    { name: "Veg Crispy", price: "₹190", category: "starters", icon: "🥗", desc: "Batter-fried crunchy garden vegetables tossed in sweet & tangy spicy sauce" },
    { name: "Veg Manchurian", price: "₹180", category: "starters", icon: "🥗", desc: "Deep-fried vegetable dumplings tossed in garlic, ginger, and soy glaze" },
    { name: "Veg 65", price: "₹200", category: "starters", icon: "🥗", desc: "Crispy spiced vegetable bites tossed with South Indian curry leaves & dry chillies" },
    { name: "Paneer Chilly", price: "₹200", category: "starters", icon: "🥗", desc: "Soft cottage cheese cubes tossed with capsicum, onions & spicy chilli sauce" },
    { name: "Soyabean Chilly", price: "₹180", category: "starters", icon: "🥗", desc: "Protein-rich soya chunks sautéed with bell peppers and Indo-Chinese spices" },
    { name: "Paneer Manchurian", price: "₹190", category: "starters", icon: "🥗", desc: "Cottage cheese florets tossed in rich ginger, garlic, and coriander sauce" },
    { name: "Paneer 65", price: "₹250", category: "starters", icon: "🥗", desc: "Crisp spiced paneer tossed with aromatic curry leaves and yogurt marinade" },
    { name: "Fry Papad", price: "₹30", category: "starters", icon: "🥗", desc: "Crispy deep-fried lentil papad" },
    { name: "Masala Papad", price: "₹40", category: "starters", icon: "🥗", desc: "Roasted papad topped with spicy onion, tomato, chat masala & coriander" },
    { name: "Roasted Papad", price: "₹30", category: "starters", icon: "🥗", desc: "Lightly charred traditional roasted papad" },

    // 🥘 VEG MAIN COURSE
    { name: "Mix Veg", price: "₹200", category: "main-course", icon: "🥘", desc: "Seasonal garden vegetables simmered in spiced onion-tomato gravy" },
    { name: "Veg Kadai", price: "₹190", category: "main-course", icon: "🥘", desc: "Vegetables & bell peppers tossed with freshly ground roasted kadai spices" },
    { name: "Veg Handi", price: "₹200", category: "main-course", icon: "🥘", desc: "Slow-cooked mixed vegetables in a rich, aromatic earthen-pot style gravy" },
    { name: "Veg Kolhapuri", price: "₹200", category: "main-course", icon: "🥘", desc: "Fiery Maharashtrian curry prepared with Kolhapuri red chilli paste & spices" },
    { name: "Veg Bhoona", price: "₹200", category: "main-course", icon: "🥘", desc: "Vegetables cooked in slow-roasted thick caramelised onion masala" },
    { name: "Veg Maratha", price: "₹220", category: "main-course", icon: "🥘", desc: "Traditional spicy vegetable kofta balls simmered in rich Maratha gravy" },
    { name: "Mushroom Kadai", price: "₹220", category: "main-course", icon: "🥘", desc: "Fresh mushrooms cooked with bell peppers, onions & roasted coriander seeds" },
    { name: "Mushroom Handi", price: "₹240", category: "main-course", icon: "🥘", desc: "Tender button mushrooms simmered in cashew-tomato handi gravy" },
    { name: "Mushroom Tikka Masala", price: "₹260", category: "main-course", icon: "🥘", desc: "Marinated roasted mushrooms simmered in rich creamy tomato butter masala" },
    { name: "Shev Bhaji", price: "₹190", category: "main-course", icon: "🥘", desc: "Authentic Khandeshi spicy curry topped with crispy gram flour sev" },

    // 🧀 PANEER SPECIAL
    { name: "Paneer Butter Masala", price: "₹220", category: "paneer", icon: "🧀", desc: "Soft cottage cheese simmered in smooth butter, cream & mild tomato makhani" },
    { name: "Paneer Masala", price: "₹220", category: "paneer", icon: "🧀", desc: "Cottage cheese cooked in a flavourful spiced onion, garlic & tomato curry" },
    { name: "Paneer Kadai", price: "₹240", category: "paneer", icon: "🧀", desc: "Paneer cubes & capsicum tossed in robust whole spices and tomato sauce" },
    { name: "Paneer Handi", price: "₹240", category: "paneer", icon: "🧀", desc: "Paneer simmered in creamy clay-pot style cashew and onion gravy" },
    { name: "Kaju Paneer Masala", price: "₹260", category: "paneer", icon: "🧀", desc: "Golden roasted cashew nuts & fresh paneer in a rich royal gravy" },
    { name: "Kaju Kari", price: "₹220", category: "paneer", icon: "🧀", desc: "Whole roasted cashews cooked in aromatic, velvety sweet-spiced gravy" },
    { name: "Paneer Matar", price: "₹220", category: "paneer", icon: "🧀", desc: "Classic combination of sweet green peas and paneer in spiced gravy" },
    { name: "Paneer Kolhapuri", price: "₹220", category: "paneer", icon: "🧀", desc: "Spicy cottage cheese curry prepared with red chilli & dry coconut paste" },
    { name: "Paneer Tikka Masala", price: "₹240", category: "paneer", icon: "🧀", desc: "Tandoori charred paneer cubes in spiced tomato and cream sauce" },
    { name: "Paneer Bhurji", price: "₹240", category: "paneer", icon: "🧀", desc: "Scrambled fresh cottage cheese sautéed with onions, green chillies & tomatoes" },
    { name: "Paneer Do Pyaza", price: "₹240", category: "paneer", icon: "🧀", desc: "Paneer prepared with caramelized and diced crunchy onions in semi-dry sauce" },
    { name: "Paneer Lasuni", price: "₹250", category: "paneer", icon: "🧀", desc: "Paneer cooked in rich golden roasted garlic and cashew-based curry" },

    // 🍛 DAL
    { name: "Dal Fry", price: "₹110", category: "dal", icon: "🍛", desc: "Yellow toor dal tempered with mustard seeds, cumin, onions & garlic" },
    { name: "Dal Tadka", price: "₹120", category: "dal", icon: "🍛", desc: "Lentils finished with sizzling ghee, roasted garlic, dry red chillies & hing" },
    { name: "Dal Khichadi", price: "₹140", category: "dal", icon: "🍛", desc: "Comforting blend of rice and lentils cooked together with mild spices & ghee" },
    { name: "Dal Jeera", price: "₹140", category: "dal", icon: "🍛", desc: "Light yellow lentils tempered with aromatic cumin seeds and butter" },
    { name: "Dal Palak", price: "₹140", category: "dal", icon: "🍛", desc: "Nutritious yellow lentils cooked with fresh pureed spinach and garlic" },
    { name: "Dal Khichadi Tadka", price: "₹190", category: "dal", icon: "🍛", desc: "Signature Dal Khichadi elevated with hot garlic-chilli ghee tadka" },

    // 🍚 RICE & PULAO
    { name: "Veg Fried Rice", price: "₹180", category: "rice", icon: "🍚", desc: "Wok-tossed basmati rice with finely chopped carrots, beans & spring onions" },
    { name: "Veg Schezwan Fried Rice", price: "₹200", category: "rice", icon: "🍚", desc: "Spicy wok-tossed rice flavored with fiery homemade Schezwan sauce" },
    { name: "Veg Triple Rice", price: "₹260", category: "rice", icon: "🍚", desc: "Combination of Fried Rice, Hakka Noodles & crispy noodles with Manchurian gravy" },
    { name: "Veg Triple Schezwan Rice", price: "₹300", category: "rice", icon: "🍚", desc: "Triple combination tossed in spicy Schezwan sauce served with hot gravy" },
    { name: "Mushroom Fried Rice", price: "₹250", category: "rice", icon: "🍚", desc: "Basmati rice wok-tossed with fresh sliced mushrooms and pepper" },
    { name: "Mushroom Schezwan Rice", price: "₹260", category: "rice", icon: "🍚", desc: "Spicy Schezwan rice loaded with sauteed button mushrooms" },
    { name: "Paneer Fried Rice", price: "₹250", category: "rice", icon: "🍚", desc: "Wok-tossed rice with golden cottage cheese cubes and vegetables" },
    { name: "Veg Hakka Noodles", price: "₹200", category: "rice", icon: "🍚", desc: "Classic stir-fried noodles with crunchy vegetables, soy & garlic" },
    { name: "Steam Rice", price: "₹170", category: "rice", icon: "🍚", desc: "Fluffy long-grain aromatic steamed basmati rice" },
    { name: "Jeera Rice", price: "₹130", category: "rice", icon: "🍚", desc: "Fragrant basmati rice tempered with roasted cumin seeds and pure ghee" },
    { name: "Plain Rice", price: "₹110", category: "rice", icon: "🍚", desc: "Simple home-style cooked white rice" },
    { name: "Veg Pulao", price: "₹200", category: "rice", icon: "🍚", desc: "Mildly spiced basmati rice cooked with garden vegetables & whole spices" },
    { name: "Green Peas Pulao", price: "₹220", category: "rice", icon: "🍚", desc: "Fragrant rice dish prepared with tender sweet green peas and ghee" },
    { name: "Kaju Pulao", price: "₹240", category: "rice", icon: "🍚", desc: "Rich royal pulao cooked with golden whole cashew nuts and saffron notes" },
    { name: "Kaju Mutter Pulao", price: "₹240", category: "rice", icon: "🍚", desc: "Aromatic pulao with sweet peas, roasted cashews and mild spices" },
    { name: "Paneer Pulao", price: "₹230", category: "rice", icon: "🍚", desc: "Basmati rice cooked with fresh paneer cubes and fragrant spices" },
    { name: "Veg Biryani", price: "₹250", category: "rice", icon: "🍚", desc: "Layered royal basmati biryani with marinated vegetables, mint & saffron" },
    { name: "Mushroom Biryani", price: "₹300", category: "rice", icon: "🍚", desc: "Dum-cooked biryani loaded with marinated button mushrooms and herbs" },
    { name: "Paneer Biryani", price: "₹300", category: "rice", icon: "🍚", desc: "Rich royal dum biryani layered with spiced paneer cubes and fried onions" },
    { name: "Dal Khichadi", price: "₹180", category: "rice", icon: "🍚", desc: "Steaming hot comfort bowl of lentil and rice khichadi with pure ghee" },

    // 🥔 VEG SABJI
    { name: "Aloo Mutter", price: "₹180", category: "sabji", icon: "🥔", desc: "Classic home-style potato and green pea curry in spiced onion gravy" },
    { name: "Aloo Gobi", price: "₹180", category: "sabji", icon: "🥔", desc: "Tender potatoes and cauliflower florets sautéed with turmeric & ginger" },
    { name: "Aloo Jeera", price: "₹180", category: "sabji", icon: "🥔", desc: "Diced potatoes tossed with aromatic roasted cumin seeds & fresh coriander" },
    { name: "Aloo Simla", price: "₹180", category: "sabji", icon: "🥔", desc: "Potatoes cooked with crunchy bell peppers and light dry spices" },
    { name: "Aloo Masala", price: "₹190", category: "sabji", icon: "🥔", desc: "Potatoes simmered in thick tangy onion-tomato masala gravy" },
    { name: "Bhendi Fry", price: "₹160", category: "sabji", icon: "🥔", desc: "Crispy sliced okra pan-fried with dry spices, onions & amchur" },
    { name: "Bhendi Masala", price: "₹140", category: "sabji", icon: "🥔", desc: "Fresh tender okra cooked in spiced onion and tomato masala" },
    { name: "Baingan Masala", price: "₹190", category: "sabji", icon: "🥔", desc: "Maharashtrian roasted eggplant curry prepared with peanuts & goda masala" },

    // 🫓 ROTI & INDIAN BREAD
    { name: "Chapati", price: "₹20", category: "roti", icon: "🫓", desc: "Fresh whole wheat thin Indian flatbread made on tawa" },
    { name: "Butter Chapati", price: "₹25", category: "roti", icon: "🫓", desc: "Soft whole wheat chapati brushed with pure table butter" },
    { name: "Bhakri (Bajari / Jowari)", price: "₹40", category: "roti", icon: "🫓", desc: "Authentic village-style wholesome millet flatbread" },

    // 🥗 RAITA & CURD
    { name: "Mix Raita", price: "₹60", category: "raita", icon: "🥗", desc: "Chilled whipped yogurt with diced cucumbers, tomatoes & roasted cumin" },
    { name: "Curd", price: "₹50", category: "raita", icon: "🥗", desc: "Fresh set thick country curd" },

    // 🍨 SWEETS & DESSERTS
    { name: "Gulab Jamun", price: "₹100", category: "sweets", icon: "🍨", desc: "Warm soft khoya milk dumplings soaked in cardamom rose sugar syrup" },
    { name: "Kheer", price: "₹90", category: "sweets", icon: "🍨", desc: "Traditional Indian rice pudding simmered with full-cream milk, nuts & saffron" },
    { name: "Sevaiyan", price: "₹90", category: "sweets", icon: "🍨", desc: "Sweet roasted vermicelli cooked in milk, ghee, cardamom and dry fruits" },
    { name: "Shira", price: "₹80", category: "sweets", icon: "🍨", desc: "Rich sweet semolina halwa prepared with pure ghee and dry fruits" },

    // 🥤 HOT DRINKS
    { name: "Tea", price: "₹20", category: "hot-drinks", icon: "🥤", desc: "Classic Indian milk tea brewed with ginger and cardamom" },
    { name: "Black Tea", price: "₹20", category: "hot-drinks", icon: "🥤", desc: "Freshly brewed aromatic black tea" },
    { name: "Lemon Tea", price: "₹20", category: "hot-drinks", icon: "🥤", desc: "Refreshing warm black tea infused with fresh lemon juice" },
    { name: "Coffee", price: "₹30", category: "hot-drinks", icon: "🥤", desc: "Rich filter-style hot coffee with frothy milk" },
    { name: "Black Coffee", price: "₹30", category: "hot-drinks", icon: "🥤", desc: "Strong, piping hot black coffee" },
    { name: "Hot Coffee", price: "₹30", category: "hot-drinks", icon: "🥤", desc: "Creamy warm blended hot coffee" },
    { name: "Cold Coffee", price: "₹90", category: "hot-drinks", icon: "🥤", desc: "Chilled thick blended coffee with vanilla ice cream notes" },

    // 🧊 COLD DRINKS
    { name: "Lassi (Sweet / Salted)", price: "₹60", category: "cold-drinks", icon: "🧊", desc: "Thick hand-churned yogurt drink in Sweet or Salted style" },
    { name: "Chaas (Plain / Masala)", price: "₹40", category: "cold-drinks", icon: "🧊", desc: "Cooling buttermilk spiced with roasted cumin, mint & rock salt" },
    { name: "Lemon Soda", price: "₹80", category: "cold-drinks", icon: "🧊", desc: "Fizzy club soda with fresh lime juice (Sweet / Salted / Mix)" },
    { name: "Lemon Water", price: "₹30", category: "cold-drinks", icon: "🧊", desc: "Refreshing natural lime water" },
    { name: "Soda", price: "₹40", category: "cold-drinks", icon: "🧊", desc: "Chilled bottled soda water" },
    { name: "Mineral Water", price: "₹20", category: "cold-drinks", icon: "🧊", desc: "Packaged purified drinking water (1 Litre)" },
    { name: "Soft Drinks", price: "₹20", category: "cold-drinks", icon: "🧊", desc: "Chilled aerated cold beverages" },

    // 🍽️ THALI
    { name: "Veg Thali", price: "₹300", category: "thali", icon: "🍽️", desc: "Complete grand royal meal: 2 Sabjis, Dal, Rice, 3 Chapatis / 2 Bhakris, Papad, Raita, Pickle, Sweet & Salad" },
  ],
};
