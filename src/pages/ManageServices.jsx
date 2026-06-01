import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Save, X, Palette, Camera, Code, BarChart3, Video, Target, Wrench, Shield, Check, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const iconMap = {
    Palette, Camera, Code, BarChart3, Video, Target, Wrench, Shield
};

const ManageServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        icon: 'Palette',
        features: '',
        color: 'from-blue-500 to-purple-600'
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;
            setServices(data || []);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (service) => {
        setCurrentService(service);
        setFormData({
            title: service.title,
            slug: service.slug,
            description: service.description,
            icon: service.icon,
            features: service.features ? service.features.join('\n') : '',
            color: service.color
        });
        setIsEditing(true);
    };

    const handleMove = async (index, direction) => {
        const otherIndex = direction === 'up' ? index - 1 : index + 1;
        if (otherIndex < 0 || otherIndex >= services.length) return;

        const currentService = services[index];
        const otherService = services[otherIndex];

        // Optimistic Update
        const newServices = [...services];
        newServices[index] = otherService;
        newServices[otherIndex] = currentService;
        setServices(newServices);

        try {
            await Promise.all([
                supabase
                    .from('services')
                    .update({ display_order: otherService.display_order })
                    .eq('id', currentService.id),
                supabase
                    .from('services')
                    .update({ display_order: currentService.display_order })
                    .eq('id', otherService.id)
            ]);
        } catch (error) {
            console.error('Error swapping order:', error);
            fetchServices(); // Revert on error
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este serviço?')) return;

        try {
            const { error } = await supabase
                .from('services')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchServices();
        } catch (error) {
            console.error('Error deleting service:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const featuresArray = formData.features.split('\n').filter(f => f.trim() !== '');
            const serviceData = {
                title: formData.title,
                slug: formData.slug || formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                description: formData.description,
                icon: formData.icon,
                features: featuresArray,
                color: formData.color
            };

            if (currentService) {
                const { error } = await supabase
                    .from('services')
                    .update(serviceData)
                    .eq('id', currentService.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('services')
                    .insert([serviceData]);
                if (error) throw error;
            }

            setIsEditing(false);
            setCurrentService(null);
            setFormData({
                title: '', slug: '', description: '', icon: 'Palette', features: '', color: 'from-blue-500 to-purple-600'
            });
            fetchServices();
        } catch (error) {
            console.error('Error saving service:', error);
            alert('Erro ao salvar serviço. Verifique se o slug é único.');
        }
    };

    const filteredServices = services.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Gerenciar Serviços</h1>
                    <p className="text-gray-400 mt-1">Adicione ou edite os serviços exibidos no site</p>
                </div>
                <Button
                    onClick={() => {
                        setCurrentService(null);
                        setFormData({ title: '', slug: '', description: '', icon: 'Palette', features: '', color: 'from-blue-500 to-purple-600' });
                        setIsEditing(true);
                    }}
                    className="bg-purple-600 hover:bg-purple-700"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Novo Serviço
                </Button>
            </div>

            {isEditing && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 p-6 rounded-xl border border-gray-700"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-white">
                            {currentService ? 'Editar Serviço' : 'Novo Serviço'}
                        </h2>
                        <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Título</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="bg-gray-900 border-gray-700 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Slug (URL)</label>
                                <Input
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="Auto-gerado se vazio"
                                    className="bg-gray-900 border-gray-700 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Ícone</label>
                                <select
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-white"
                                >
                                    {Object.keys(iconMap).map(iconName => (
                                        <option key={iconName} value={iconName}>{iconName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Cor (Gradiente Tailwind)</label>
                                <Input
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    placeholder="from-blue-500 to-purple-600"
                                    className="bg-gray-900 border-gray-700 text-white"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Descrição</label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                                className="bg-gray-900 border-gray-700 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Recursos (um por linha)</label>
                            <Textarea
                                value={formData.features}
                                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                className="bg-gray-900 border-gray-700 text-white h-32"
                                placeholder="Ex: Sites Responsivos&#10;E-commerce"
                            />
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button type="submit" className="bg-green-600 hover:bg-green-700">
                                <Save className="w-5 h-5 mr-2" />
                                Salvar Serviço
                            </Button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                    type="text"
                    placeholder="Buscar serviços..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white w-full md:w-96"
                />
            </div>

            {/* Services Grid */}
            {loading ? (
                <div className="text-center py-20 text-gray-400">Carregando serviços...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map((service, index) => {
                        const IconComponent = iconMap[service.icon] || Palette;
                        return (
                            <motion.div
                                key={service.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-colors group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center`}>
                                        <IconComponent className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleMove(index, 'up')}
                                            disabled={index === 0}
                                        >
                                            <ArrowUp className="w-4 h-4 text-gray-400 hover:text-white" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleMove(index, 'down')}
                                            disabled={index === filteredServices.length - 1}
                                        >
                                            <ArrowDown className="w-4 h-4 text-gray-400 hover:text-white" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}>
                                            <Edit2 className="w-4 h-4 text-blue-400" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)}>
                                            <Trash2 className="w-4 h-4 text-red-400" />
                                        </Button>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{service.description}</p>
                                <div className="space-y-1">
                                    {service.features && service.features.slice(0, 3).map((feature, i) => (
                                        <div key={i} className="flex items-center text-xs text-gray-500">
                                            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-2" />
                                            {feature}
                                        </div>
                                    ))}
                                    {service.features && service.features.length > 3 && (
                                        <span className="text-xs text-gray-600 pl-3.5">+{service.features.length - 3} mais</span>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ManageServices;
