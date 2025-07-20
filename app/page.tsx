"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, Star, Plus, Minus, Search, X, Clock, Filter, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import menuData from "../data/menu.json"

interface MenuItem {
    id: number
    name: string
    category: string
    price: number
    description: string
    image: string
    rating: number
    popular?: boolean
    prepTime: string
}

interface Category {
    id: string
    name: string
    icon: string
    color: string
}

interface CartItem extends MenuItem {
    quantity: number
}

export default function FoodTimeApp() {
    const [items, setItems] = useState<MenuItem[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [cart, setCart] = useState<CartItem[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [sortBy, setSortBy] = useState<string>("popular")
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [favorites, setFavorites] = useState<number[]>([])

    useEffect(() => {
        setItems(menuData.items)
        setCategories(menuData.categories)
    }, [])

    const filteredItems = items.filter((item) => {
        const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesCategory && matchesSearch
    })

    const sortedItems = [...filteredItems].sort((a, b) => {
        switch (sortBy) {
            case "price-low":
                return a.price - b.price
            case "price-high":
                return b.price - a.price
            case "rating":
                return b.rating - a.rating
            case "popular":
                return (b.popular ? 1 : 0) - (a.popular ? 1 : 0)
            default:
                return a.name.localeCompare(b.name)
        }
    })

    const addToCart = (item: MenuItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.id === item.id)
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
                )
            }
            return [...prevCart, { ...item, quantity: 1 }]
        })
    }

    const removeFromCart = (itemId: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== itemId))
    }

    const updateQuantity = (itemId: number, newQuantity: number) => {
        if (newQuantity === 0) {
            removeFromCart(itemId)
            return
        }
        setCart((prevCart) => prevCart.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
    }

    const toggleFavorite = (itemId: number) => {
        setFavorites((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
    }

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0)
    }

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0)
    }

    const getCategoryColor = (categoryId: string) => {
        const category = categories.find((cat) => cat.id === categoryId)
        return category?.color || "from-gray-400 to-gray-500"
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-40 border-b border-purple-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <div className="text-3xl animate-bounce">🍽️</div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    FoodTime
                                </h1>
                                <p className="text-xs text-gray-500">Delicious & Fast</p>
                            </div>
                        </div>

                        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                            <SheetTrigger asChild>
                                <Button className="relative bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg">
                                    <ShoppingCart className="h-5 w-5 mr-2" />
                                    Cart
                                    {getTotalItems() > 0 && (
                                        <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-gradient-to-r from-orange-400 to-red-500 animate-pulse">
                                            {getTotalItems()}
                                        </Badge>
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="w-full sm:max-w-lg bg-gradient-to-br from-white to-purple-50">
                                <SheetHeader>
                                    <SheetTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        Your Order 🛒
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="mt-6 space-y-4">
                                    {cart.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="text-6xl mb-4">🛒</div>
                                            <p className="text-gray-500 text-lg">Your cart is empty</p>
                                            <p className="text-gray-400 text-sm">Add some delicious items!</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="max-h-96 overflow-y-auto space-y-3">
                                                {cart.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center space-x-4 bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-md border border-purple-100"
                                                    >
                                                        <img
                                                            src={item.image || "/placeholder.svg"}
                                                            alt={item.name}
                                                            className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                                        />
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-800">{item.name}</h4>
                                                            <p className="text-purple-600 font-bold">${item.price.toFixed(2)}</p>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 w-8 p-0 rounded-full border-purple-200 hover:bg-purple-50 bg-transparent"
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            >
                                                                <Minus className="h-3 w-3" />
                                                            </Button>
                                                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 w-8 p-0 rounded-full border-purple-200 hover:bg-purple-50 bg-transparent"
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            >
                                                                <Plus className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                                                            onClick={() => removeFromCart(item.id)}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="border-t border-purple-200 pt-4 bg-white/50 backdrop-blur-sm rounded-xl p-4">
                                                <div className="flex justify-between items-center text-xl font-bold mb-4">
                                                    <span>Total:</span>
                                                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                        ${getTotalPrice().toFixed(2)}
                                                    </span>
                                                </div>
                                                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 shadow-lg">
                                                    Proceed to Checkout 🚀
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="animate-fade-in">
                        <h2 className="text-5xl md:text-8xl font-bold mb-6 drop-shadow-lg">
                            Delicious Food
                            <span className="block text-yellow-300">Delivered Fast </span>
                        </h2>

                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-purple-50 to-transparent"></div>
            </section>

            {/* Filters and Search */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-4 mb-8">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
                            <Input
                                placeholder="Search for delicious food..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 h-12 border-purple-200 focus:border-purple-400 bg-white/70 backdrop-blur-sm"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full lg:w-48 h-12 border-purple-200 bg-white/70 backdrop-blur-sm">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="popular">🔥 Popular</SelectItem>
                                <SelectItem value="name">📝 Name</SelectItem>
                                <SelectItem value="price-low">💰 Price: Low to High</SelectItem>
                                <SelectItem value="price-high">💎 Price: High to Low</SelectItem>
                                <SelectItem value="rating">⭐ Rating</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-3 mb-8">
                    <Button
                        variant={selectedCategory === "all" ? "default" : "outline"}
                        onClick={() => setSelectedCategory("all")}
                        className={`h-12 px-6 rounded-full font-semibold transition-all duration-300 ${selectedCategory === "all"
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
                            : "bg-white/70 backdrop-blur-sm border-purple-200 hover:bg-purple-50"
                            }`}
                    >
                        🌟 All Items
                    </Button>
                    {categories.map((category) => (
                        <Button
                            key={category.id}
                            variant={selectedCategory === category.id ? "default" : "outline"}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`h-12 px-6 rounded-full font-semibold transition-all duration-300 ${selectedCategory === category.id
                                ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-105`
                                : "bg-white/70 backdrop-blur-sm border-purple-200 hover:bg-purple-50"
                                }`}
                        >
                            <span className="mr-2 text-lg">{category.icon}</span>
                            {category.name}
                        </Button>
                    ))}
                </div>

                {/* Food Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sortedItems.map((item) => (
                        <Card
                            key={item.id}
                            className="group overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
                        >
                            <div className="relative overflow-hidden">
                                <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                {item.popular && (
                                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-orange-400 to-red-500 text-white font-semibold px-3 py-1 animate-pulse">
                                        🔥 Popular
                                    </Badge>
                                )}
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="absolute top-3 right-3 h-8 w-8 p-0 bg-white/80 backdrop-blur-sm hover:bg-white"
                                    onClick={() => toggleFavorite(item.id)}
                                >
                                    <Heart
                                        className={`h-4 w-4 ${favorites.includes(item.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                                    />
                                </Button>
                            </div>
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-600 transition-colors">
                                        {item.name}
                                    </h3>
                                    <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-semibold text-yellow-600">{item.rating}</span>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-2 text-gray-500">
                                        <Clock className="h-4 w-4" />
                                        <span className="text-sm">{item.prepTime}</span>
                                    </div>
                                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        ${item.price.toFixed(2)}
                                    </span>
                                </div>
                                <Button
                                    onClick={() => addToCart(item)}
                                    className={`w-full bg-gradient-to-r ${getCategoryColor(item.category)} text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add to Cart
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {sortedItems.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-8xl mb-4">🔍</div>
                        <p className="text-gray-500 text-xl mb-2">No items found matching your criteria</p>
                        <p className="text-gray-400">Try adjusting your search or filters</p>
                    </div>
                )}
            </section>

            {/* Stats Section */}
            <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="space-y-2">
                            <div className="text-4xl font-bold">60+</div>
                            <div className="text-purple-200">Menu Items</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-4xl font-bold">15min</div>
                            <div className="text-purple-200">Avg Delivery</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-4xl font-bold">4.8⭐</div>
                            <div className="text-purple-200">Customer Rating</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-4xl font-bold">24/7</div>
                            <div className="text-purple-200">Always Open</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gradient-to-br from-gray-900 to-purple-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="text-3xl">🍽️</div>
                                <div>
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                        FoodTime
                                    </h3>
                                    <p className="text-gray-400 text-sm">Delicious & Fast</p>
                                </div>
                            </div>
                            <p className="text-gray-300 leading-relaxed">
                                Experience the finest culinary delights delivered straight to your doorstep. Quality ingredients,
                                amazing taste, unbeatable service.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-purple-300">Quick Links</h4>
                            <ul className="space-y-3 text-gray-300">
                                <li>
                                    <a href="#" className="hover:text-purple-400 transition-colors">
                                        🍕 Menu
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-purple-400 transition-colors">
                                        ℹ️ About Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-purple-400 transition-colors">
                                        📞 Contact
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-purple-400 transition-colors">
                                        ❓ FAQ
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-purple-300">Categories</h4>
                            <ul className="space-y-3 text-gray-300">
                                <li>
                                    <a href="#" className="hover:text-purple-400 transition-colors">
                                        🍔 Burgers
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-purple-400 transition-colors">
                                        🍕 Pizza
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-purple-400 transition-colors">
                                        🍝 Pasta
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-purple-400 transition-colors">
                                        🍰 Desserts
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-purple-300">Contact Info</h4>
                            <div className="space-y-3 text-gray-300">
                                <p className="flex items-center space-x-2">
                                    <span>📞</span>
                                    <span>(555) 123-4567</span>
                                </p>
                                <p className="flex items-center space-x-2">
                                    <span>📧</span>
                                    <span>hello@foodtime.com</span>
                                </p>
                                <p className="flex items-center space-x-2">
                                    <span>📍</span>
                                    <span>123 Food Street, Flavor City</span>
                                </p>
                                <p className="flex items-center space-x-2">
                                    <span>🕒</span>
                                    <span>Open 24/7</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 mt-12 pt-8 text-center">
                        <p className="text-gray-400">&copy; 2024 FoodTime. Made with ❤️ for food lovers everywhere.</p>
                    </div>
                </div>
            </footer>

            {/* Floating Action Button */}
            {cart.length > 0 && (
                <div className="fixed bottom-6 right-6 z-50">
                    <Button
                        onClick={() => setIsCartOpen(true)}
                        className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-2xl animate-bounce"
                    >
                        <div className="relative">
                            <ShoppingCart className="h-6 w-6" />
                            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-orange-500 text-xs">
                                {getTotalItems()}
                            </Badge>
                        </div>
                    </Button>
                </div>
            )}
        </div>
    )
}