/**
 * Contacts / Address Book Page
 * 
 * Manage contacts with multi-chain address support
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  Plus,
  Star,
  StarOff,
  Edit2,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  User,
  Users,
  Building2,
  MoreVertical,
  X,
  ChevronDown,
  Send,
} from 'lucide-react';
import Link from 'next/link';
import { useWallet, WalletGuard } from '@/providers/WalletProvider';
import { useWalletStore, useContacts } from '@/lib/wallets/store';
import { useContactSearch } from '@/lib/wallets/hooks';
import { Contact, ContactAddress } from '@/lib/wallets/types';
import { truncateAddress, getExplorerUrl, isValidAddress } from '@/lib/wallets/utils';
import { NETWORK_CONFIGS } from '@/lib/wallets/networks';
import { WalletStatus } from '@/components/wallets/WalletStatus';
import { NetworkSwitcher } from '@/components/wallets/NetworkSwitcher';
import { cn } from '@/lib/utils';

// ============================================
// Contact Card Component
// ============================================

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onSend: (contact: Contact) => void;
}

function ContactCard({ contact, onEdit, onDelete, onToggleFavorite, onSend }: ContactCardProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(address);
    setTimeout(() => setCopied(null), 2000);
  };

  // Get primary address for display
  const primaryAddress = contact.addresses.find(a => a.isPrimary) || contact.addresses[0];

  // Get avatar background based on first letter
  const getAvatarBg = (name: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0',
          contact.avatarUrl ? 'bg-gray-100' : getAvatarBg(contact.name)
        )}>
          {contact.avatarUrl ? (
            <img src={contact.avatarUrl} alt={contact.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            contact.name.charAt(0).toUpperCase()
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {contact.name}
            </h3>
            {contact.isFavorite && (
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 shrink-0" />
            )}
            {contact.isVerified && (
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {contact.ensName && (
            <p className="text-sm text-blue-500">{contact.ensName}</p>
          )}

          {/* Tags */}
          {contact.tags && contact.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {contact.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Addresses */}
          <div className="mt-3 space-y-2">
            {contact.addresses.slice(0, 2).map((addr) => {
              const network = NETWORK_CONFIGS.find((n: { family: string }) => n.family === addr.chain);
              return (
                <div key={addr.address} className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500 capitalize">{addr.chain}:</span>
                  <button
                    onClick={() => copyAddress(addr.address)}
                    className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-mono"
                  >
                    {addr.label || truncateAddress(addr.address)}
                    {copied === addr.address ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3 text-gray-400" />
                    )}
                  </button>
                </div>
              );
            })}
            {contact.addresses.length > 2 && (
              <p className="text-sm text-gray-500">
                +{contact.addresses.length - 2} more addresses
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onSend(contact)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Send"
          >
            <Send className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => onToggleFavorite(contact.id)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title={contact.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {contact.isFavorite ? (
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            ) : (
              <StarOff className="w-4 h-4 text-gray-400" />
            )}
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>

            <AnimatePresence>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden"
                  >
                    <button
                      onClick={() => {
                        onEdit(contact);
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        onDelete(contact.id);
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// Add/Edit Contact Modal
// ============================================

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact?: Contact | null;
  onSave: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

function ContactModal({ isOpen, onClose, contact, onSave }: ContactModalProps) {
  const [name, setName] = useState(contact?.name || '');
  const [ensName, setEnsName] = useState(contact?.ensName || '');
  const [notes, setNotes] = useState(contact?.notes || '');
  const [addresses, setAddresses] = useState<ContactAddress[]>(
    contact?.addresses || [{ address: '', chain: 'evm', chainFamily: 'evm' as const, isPrimary: true, isVerified: false }]
  );
  const [tags, setTags] = useState<string[]>(contact?.tags || []);
  const [newTag, setNewTag] = useState('');

  const addAddress = () => {
    setAddresses([...addresses, { address: '', chain: 'evm', chainFamily: 'evm' as const, isPrimary: false, isVerified: false }]);
  };

  const removeAddress = (index: number) => {
    if (addresses.length > 1) {
      const newAddresses = addresses.filter((_, i) => i !== index);
      if (addresses[index].isPrimary && newAddresses.length > 0) {
        newAddresses[0].isPrimary = true;
      }
      setAddresses(newAddresses);
    }
  };

  const updateAddress = (index: number, updates: Partial<ContactAddress>) => {
    const newAddresses = [...addresses];
    newAddresses[index] = { ...newAddresses[index], ...updates };
    setAddresses(newAddresses);
  };

  const setPrimaryAddress = (index: number) => {
    const newAddresses = addresses.map((addr, i) => ({
      ...addr,
      isPrimary: i === index,
    }));
    setAddresses(newAddresses);
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSave = () => {
    if (!name || addresses.every(a => !a.address)) return;
    
    onSave({
      name,
      ensName: ensName || undefined,
      notes: notes || undefined,
      addresses: addresses.filter(a => a.address),
      tags,
      isFavorite: contact?.isFavorite || false,
      isVerified: false,
      groups: [],
      totalVolumeUsd: 0,
      transactionCount: 0,
    });
    onClose();
  };

  // Validate addresses
  const isValid = name && addresses.some(a => a.address && a.chainFamily && isValidAddress(a.address, a.chainFamily));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-x-4 top-[5%] bottom-[5%] mx-auto max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {contact ? 'Edit Contact' : 'Add Contact'}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contact name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                />
              </div>

              {/* ENS Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ENS Name
                </label>
                <input
                  type="text"
                  value={ensName}
                  onChange={(e) => setEnsName(e.target.value)}
                  placeholder="vitalik.eth"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                />
              </div>

              {/* Addresses */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Addresses *
                  </label>
                  <button
                    onClick={addAddress}
                    className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Address
                  </button>
                </div>
                <div className="space-y-3">
                  {addresses.map((addr, index) => (
                    <div key={index} className="flex gap-2">
                      <select
                        value={addr.chain}
                        onChange={(e) => updateAddress(index, { chain: e.target.value as 'evm' | 'solana' | 'bitcoin' })}
                        className="px-3 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                      >
                        <option value="evm">EVM</option>
                        <option value="solana">Solana</option>
                        <option value="bitcoin">Bitcoin</option>
                      </select>
                      <input
                        type="text"
                        value={addr.address}
                        onChange={(e) => updateAddress(index, { address: e.target.value })}
                        placeholder="0x..."
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:border-blue-500 font-mono text-sm text-gray-900 dark:text-white"
                      />
                      <button
                        onClick={() => setPrimaryAddress(index)}
                        className={cn(
                          'px-3 py-2 rounded-lg border transition-colors',
                          addr.isPrimary
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-500'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                        )}
                        title="Set as primary"
                      >
                        {addr.isPrimary ? '★' : '☆'}
                      </button>
                      {addresses.length > 1 && (
                        <button
                          onClick={() => removeAddress(index)}
                          className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm"
                    >
                      {tag}
                      <button onClick={() => removeTag(tag)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                    placeholder="Add tag..."
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:border-blue-500 text-sm text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:border-blue-500 resize-none text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!isValid}
                className={cn(
                  'flex-1 py-3 font-medium rounded-xl transition-colors',
                  isValid
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                )}
              >
                {contact ? 'Save Changes' : 'Add Contact'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================
// Main Contacts Page
// ============================================

export default function ContactsPage() {
  const { currentNetwork } = useWallet();
  const contacts = useContacts();
  const { addContact, updateContact, deleteContact } = useWalletStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Filter and search contacts
  const filteredContacts = useMemo(() => {
    let result = contacts;

    if (filter === 'favorites') {
      result = result.filter(c => c.isFavorite);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.ensName?.toLowerCase().includes(query) ||
        c.tags?.some(t => t.toLowerCase().includes(query)) ||
        c.addresses.some(a => a.address.toLowerCase().includes(query))
      );
    }

    // Sort: favorites first, then alphabetically
    return result.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [contacts, filter, searchQuery]);

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      deleteContact(id);
    }
  };

  const handleToggleFavorite = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    if (contact) {
      updateContact(id, { isFavorite: !contact.isFavorite });
    }
  };

  const handleSend = (contact: Contact) => {
    const primaryAddress = contact.addresses.find(a => a.isPrimary) || contact.addresses[0];
    window.location.href = `/wallets/send?to=${primaryAddress.address}`;
  };

  const handleSave = (contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingContact) {
      updateContact(editingContact.id, contactData);
    } else {
      addContact(contactData);
    }
    setEditingContact(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/wallets/dashboard"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Address Book
            </h1>
            <p className="text-gray-500">{contacts.length} contacts</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <NetworkSwitcher compact />
          <WalletStatus />
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none focus:border-blue-500 text-gray-900 dark:text-white"
          />
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-colors',
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            <Users className="w-4 h-4 inline mr-2" />
            All
          </button>
          <button
            onClick={() => setFilter('favorites')}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-colors',
              filter === 'favorites'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            <Star className="w-4 h-4 inline mr-2" />
            Favorites
          </button>
        </div>

        {/* Add Contact */}
        <button
          onClick={() => {
            setEditingContact(null);
            setIsModalOpen(true);
          }}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Contact
        </button>
      </div>

      {/* Contacts List */}
      {filteredContacts.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center">
          {searchQuery || filter === 'favorites' ? (
            <>
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No contacts found
              </h2>
              <p className="text-gray-500 mb-6">
                {filter === 'favorites'
                  ? 'You haven\'t added any favorites yet.'
                  : 'Try a different search term.'}
              </p>
            </>
          ) : (
            <>
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No contacts yet
              </h2>
              <p className="text-gray-500 mb-6">
                Add your first contact to get started.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Contact
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {filteredContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
                onSend={handleSend}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingContact(null);
        }}
        contact={editingContact}
        onSave={handleSave}
      />
    </div>
  );
}
