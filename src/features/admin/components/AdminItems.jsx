import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../../../api/api';

const TABLES_CONFIG = {
  item4: {
    label: '🧪 Dược Phẩm & Rương (item4)',
    shortLabel: 'Item4 (Dược phẩm/Rương)',
    primaryKey: ['id'],
    displayColumns: [
      { key: 'id', label: 'ID', width: '80px' },
      { key: 'name', label: 'Tên vật phẩm' },
      { key: 'icon', label: 'Icon ID', width: '90px' },
      { key: 'price', label: 'Giá Beri' },
      { key: 'priceruby', label: 'Giá Ruby' },
      { key: 'indexInfoPotion', label: 'Info ID' },
      { key: 'nameuse', label: 'Tên nút dùng' },
    ],
    fields: [
      { key: 'id', label: 'ID (Bắt buộc)', type: 'number', required: true },
      { key: 'name', label: 'Tên vật phẩm', type: 'text', required: true },
      { key: 'icon', label: 'Icon ID', type: 'number', required: true },
      { key: 'indexInfoPotion', label: 'ID Thông tin (item4_info)', type: 'number', defaultValue: 0 },
      { key: 'price', label: 'Giá Beri', type: 'number', defaultValue: 0 },
      { key: 'priceruby', label: 'Giá Ruby', type: 'number', defaultValue: 0 },
      { key: 'istrade', label: 'Có thể giao dịch (1: Có, 0: Không)', type: 'number', defaultValue: 1 },
      { key: 'hpmpother', label: 'Loại HP/MP/Other', type: 'number', defaultValue: 0 },
      { key: 'timedelay', label: 'Thời gian hồi (delay ms)', type: 'number', defaultValue: 0 },
      { key: 'value', label: 'Giá trị hồi phục / Chỉ số', type: 'number', defaultValue: 0 },
      { key: 'timeactive', label: 'Thời gian hiệu lực (s)', type: 'number', defaultValue: 0 },
      { key: 'nameuse', label: 'Tên thao tác (VD: Sử dụng, Mở rương)', type: 'text', defaultValue: 'Sử dụng' },
    ]
  },
  item3: {
    label: '⚔️ Trang Bị & Vũ Khí (item3)',
    shortLabel: 'Item3 (Trang bị/Vũ khí)',
    primaryKey: ['id'],
    displayColumns: [
      { key: 'id', label: 'ID', width: '80px' },
      { key: 'name', label: 'Tên trang bị' },
      { key: 'clazz', label: 'Phái', width: '70px' },
      { key: 'typeequip', label: 'Loại đồ', width: '80px' },
      { key: 'level', label: 'Cấp độ', width: '80px' },
      { key: 'color', label: 'Phẩm chất (Màu)', width: '120px' },
      { key: 'icon', label: 'Icon ID', width: '80px' },
    ],
    fields: [
      { key: 'id', label: 'ID (Bắt buộc)', type: 'number', required: true },
      { key: 'name', label: 'Tên trang bị', type: 'text', required: true },
      { key: 'clazz', label: 'Hệ/Phái (0: Chung, 1: Kiếm, 2: Súng, 3: Quyền...)', type: 'number', defaultValue: 0 },
      { key: 'typeequip', label: 'Loại đồ (0: Vũ khí, 1: Nón, 2: Dây chuyền, 3: Áo, 4: Quần...)', type: 'number', defaultValue: 0 },
      { key: 'icon', label: 'Icon ID', type: 'number', required: true },
      { key: 'level', label: 'Cấp độ yêu cầu', type: 'number', defaultValue: 1 },
      { key: 'color', label: 'Phẩm chất màu (0: Trắng, 1: Xanh, 2: Vàng, 3: Tím, 4: Cam, 8: Đỏ...)', type: 'number', defaultValue: 0 },
      { key: 'typelock', label: 'Khóa trang bị (0: Không, 1: Khóa)', type: 'number', defaultValue: 0 },
      { key: 'numHoleDaDuc', label: 'Số lỗ đã đục', type: 'number', defaultValue: 0 },
      { key: 'chetac', label: 'Điểm chế tác', type: 'number', defaultValue: 100 },
      { key: 'ishoanmy', label: 'Đồ Hoàn Mỹ (0/1)', type: 'number', defaultValue: 0 },
      { key: 'valuekichan', label: 'Giá trị kích ẩn', type: 'number', defaultValue: 0 },
      { key: 'op_1', label: 'Chỉ số Op 1 (JSON [[id, param], ...])', type: 'text', defaultValue: '[]', helper: 'Ví dụ: [[1, 50], [3, 20]]' },
      { key: 'op_2', label: 'Chỉ số Op 2 (JSON [[id, param], ...])', type: 'text', defaultValue: '[]', helper: 'Ví dụ: [[15, 10]]' },
      { key: 'numlokham', label: 'Số lỗ khảm', type: 'number', defaultValue: 0 },
      { key: 'mdakham', label: 'Đá khảm (JSON array)', type: 'text', defaultValue: '[]' },
      { key: 'part', label: 'Part ID', type: 'number', defaultValue: 0 },
      { key: 'beri', label: 'Giá Beri bán shop', type: 'number', defaultValue: 0 },
      { key: 'ruby', label: 'Giá Ruby', type: 'number', defaultValue: 0 },
    ]
  },
  item7: {
    label: '💎 Nguyên Liệu (item7)',
    shortLabel: 'Item7 (Nguyên liệu)',
    primaryKey: ['id'],
    displayColumns: [
      { key: 'id', label: 'ID', width: '80px' },
      { key: 'name', label: 'Tên nguyên liệu' },
      { key: 'type', label: 'Loại', width: '80px' },
      { key: 'icon', label: 'Icon ID', width: '90px' },
      { key: 'price', label: 'Giá Beri' },
      { key: 'priceruby', label: 'Giá Ruby' },
      { key: 'istrade', label: 'Giao dịch', width: '100px' },
    ],
    fields: [
      { key: 'id', label: 'ID (Bắt buộc)', type: 'number', required: true },
      { key: 'name', label: 'Tên nguyên liệu', type: 'text', required: true },
      { key: 'type', label: 'Loại nguyên liệu', type: 'number', defaultValue: 0 },
      { key: 'icon', label: 'Icon ID', type: 'number', required: true },
      { key: 'price', label: 'Giá Beri', type: 'number', defaultValue: 0 },
      { key: 'priceruby', label: 'Giá Ruby', type: 'number', defaultValue: 0 },
      { key: 'istrade', label: 'Có thể giao dịch (1: Có, 0: Không)', type: 'number', defaultValue: 1 },
    ]
  },
  item4_info: {
    label: '📜 Mô Tả Dược Phẩm (item4_info)',
    shortLabel: 'Item4_Info (Mô tả)',
    primaryKey: ['id'],
    displayColumns: [
      { key: 'id', label: 'ID Info', width: '100px' },
      { key: 'info', label: 'Nội dung mô tả' },
    ],
    fields: [
      { key: 'id', label: 'ID Info (Bắt buộc)', type: 'number', required: true },
      { key: 'info', label: 'Nội dung mô tả', type: 'textarea', required: true },
    ]
  },
  shoptichluy: {
    label: '🏪 Shop Tích Luỹ (shoptichluy)',
    shortLabel: 'Shop Tích Luỹ',
    primaryKey: ['id', 'type'],
    displayColumns: [
      { key: 'id', label: 'Item ID', width: '90px' },
      { key: 'type', label: 'Loại Item (3, 4, 7)', width: '120px' },
      { key: 'point', label: 'Điểm đổi', width: '100px' },
      { key: 'limit', label: 'Giới hạn đổi', width: '110px' },
      { key: 'info', label: 'Mô tả / Tên hiển thị' },
    ],
    fields: [
      { key: 'id', label: 'Item ID (Bắt buộc)', type: 'number', required: true },
      { key: 'type', label: 'Loại Item (3: Trang bị, 4: Rương/Dược phẩm, 7: NL)', type: 'number', required: true, defaultValue: 4 },
      { key: 'point', label: 'Điểm tích luỹ cần đổi', type: 'number', defaultValue: 10 },
      { key: 'info', label: 'Mô tả vật phẩm trong shop', type: 'text' },
      { key: 'limit', label: 'Giới hạn đổi (lượt)', type: 'number', defaultValue: 10 },
      { key: 'limit_data', label: 'Dữ liệu giới hạn (JSON)', type: 'text', defaultValue: '[]' },
    ]
  },
  pet_template: {
    label: '🐾 Thú Cưng / Pet (pet_template)',
    shortLabel: 'Pet Template',
    primaryKey: ['id'],
    displayColumns: [
      { key: 'id', label: 'ID', width: '80px' },
      { key: 'name', label: 'Tên Pet' },
      { key: 'icon', label: 'Icon ID', width: '90px' },
      { key: 'type', label: 'Loại Pet', width: '90px' },
      { key: 'frame', label: 'Frame', width: '80px' },
      { key: 'show', label: 'Hiển thị', width: '90px' },
      { key: 'op', label: 'Chỉ số Op' },
    ],
    fields: [
      { key: 'id', label: 'ID Pet (Bắt buộc)', type: 'number', required: true },
      { key: 'name', label: 'Tên Pet', type: 'text', required: true },
      { key: 'icon', label: 'Icon ID', type: 'number', required: true },
      { key: 'type', label: 'Loại Pet', type: 'number', defaultValue: 0 },
      { key: 'frame', label: 'Frame chuyển động', type: 'number', defaultValue: 1 },
      { key: 'op', label: 'Chỉ số thuộc tính (JSON [[id, val], ...])', type: 'text', defaultValue: '[]', helper: 'Ví dụ: [[1, 100], [2, 50]]' },
      { key: 'show', label: 'Cho phép hiển thị (1: Có, 0: Không)', type: 'number', defaultValue: 1 },
    ]
  },
  itemhair: {
    label: '💇 Kiểu Tóc (itemhair)',
    shortLabel: 'Kiểu Tóc (Itemhair)',
    primaryKey: ['id'],
    displayColumns: [
      { key: 'id', label: 'ID', width: '80px' },
      { key: 'name', label: 'Tên kiểu tóc' },
      { key: 'icon', label: 'Icon ID', width: '90px' },
      { key: 'beri', label: 'Giá Beri' },
      { key: 'ruby', label: 'Giá Ruby' },
    ],
    fields: [
      { key: 'id', label: 'ID (Bắt buộc)', type: 'number', required: true },
      { key: 'name', label: 'Tên kiểu tóc', type: 'text', required: true },
      { key: 'icon', label: 'Icon ID', type: 'number', required: true },
      { key: 'beri', label: 'Giá Beri', type: 'number', defaultValue: 0 },
      { key: 'ruby', label: 'Giá Ruby', type: 'number', defaultValue: 0 },
    ]
  },
  fashiontemplate: {
    label: '👘 Thời Trang (fashiontemplate)',
    shortLabel: 'Thời Trang (Fashion)',
    primaryKey: ['id'],
    displayColumns: [
      { key: 'id', label: 'ID', width: '80px' },
      { key: 'name', label: 'Tên thời trang' },
      { key: 'icon', label: 'Icon ID', width: '90px' },
      { key: 'price', label: 'Giá bán (Ruby/Beri)', width: '120px' },
      { key: 'info', label: 'Thông tin mô tả' },
    ],
    fields: [
      { key: 'id', label: 'ID (Bắt buộc)', type: 'number', required: true },
      { key: 'name', label: 'Tên thời trang', type: 'text', required: true },
      { key: 'icon', label: 'Icon ID', type: 'number', required: true },
      { key: 'info', label: 'Mô tả bộ thời trang', type: 'text' },
      { key: 'mwear', label: 'Mwear Parts (JSON [head, body, leg, ...])', type: 'text', defaultValue: '[]', helper: 'Ví dụ: [100, 101, 102]' },
      { key: 'op', label: 'Chỉ số Op (JSON [[id, val], ...])', type: 'text', defaultValue: '[]', helper: 'Ví dụ: [[1, 50], [3, 20]]' },
      { key: 'price', label: 'Giá bán', type: 'number', defaultValue: 0 },
    ]
  },
  danhhieu: {
    label: '👑 Danh Hiệu (danhhieu)',
    shortLabel: 'Danh Hiệu (Danhhieu)',
    primaryKey: ['id'],
    displayColumns: [
      { key: 'id', label: 'ID', width: '80px' },
      { key: 'name', label: 'Tên danh hiệu' },
      { key: 'idicon', label: 'Icon ID', width: '90px' },
      { key: 'nframe', label: 'Số Frame', width: '90px' },
      { key: 'vnd', label: 'Giá VND / Điểm', width: '120px' },
      { key: 'sell', label: 'Bán Shop (1: Có, 0: Không)', width: '130px' },
    ],
    fields: [
      { key: 'id', label: 'ID (Bắt buộc)', type: 'number', required: true },
      { key: 'name', label: 'Tên danh hiệu', type: 'text', required: true },
      { key: 'idicon', label: 'Icon ID', type: 'number', required: true },
      { key: 'nframe', label: 'Số Frame animation', type: 'number', defaultValue: 6 },
      { key: 'op', label: 'Chỉ số Op (JSON [[id, val], ...])', type: 'text', defaultValue: '[]', helper: 'Ví dụ: [[1, 50], [3, 20]]' },
      { key: 'vnd', label: 'Giá VND / Điểm bán', type: 'number', defaultValue: 0 },
      { key: 'sell', label: 'Bán trong Shop (1: Có, 0: Không)', type: 'number', defaultValue: 0 },
    ]
  },
  skill: {
    label: '⚡ Kỹ Năng / Chiêu Thức (skill)',
    shortLabel: 'Kỹ Năng (Skill)',
    primaryKey: ['id'],
    displayColumns: [
      { key: 'id', label: 'ID', width: '70px' },
      { key: 'name', label: 'Tên kỹ năng' },
      { key: 'icon', label: 'Icon', width: '70px' },
      { key: 'typeSkill', label: 'Loại', width: '70px' },
      { key: 'damage', label: 'Sát thương' },
      { key: 'manaLost', label: 'MP hao' },
      { key: 'timeDelay', label: 'Hồi chiêu' },
      { key: 'Lv_RQ', label: 'Level Y/C', width: '80px' },
    ],
    fields: [
      { key: 'id', label: 'ID Kỹ năng (Bắt buộc)', type: 'number', required: true },
      { key: 'name', label: 'Tên kỹ năng', type: 'text', required: true },
      { key: 'icon', label: 'Icon ID', type: 'number', defaultValue: 0 },
      { key: 'id_index', label: 'Index Skill', type: 'number', defaultValue: 0 },
      { key: 'typeSkill', label: 'Loại kỹ năng (0: Chủ động, 1: Bị động...)', type: 'number', defaultValue: 0 },
      { key: 'typeBuff', label: 'Loại Buff', type: 'number', defaultValue: 0 },
      { key: 'damage', label: 'Sát thương cơ bản', type: 'number', defaultValue: 100 },
      { key: 'manaLost', label: 'MP tiêu hao', type: 'number', defaultValue: 10 },
      { key: 'timeDelay', label: 'Thời gian hồi chiêu (ms)', type: 'number', defaultValue: 1000 },
      { key: 'nTarget', label: 'Số mục tiêu', type: 'number', defaultValue: 1 },
      { key: 'range', label: 'Tầm xa (range)', type: 'number', defaultValue: 100 },
      { key: 'Lv_RQ', label: 'Cấp độ yêu cầu', type: 'number', defaultValue: 1 },
      { key: 'info', label: 'Mô tả chiêu thức', type: 'textarea' },
      { key: 'option', label: 'Thuộc tính thêm (JSON/Chuỗi)', type: 'text', defaultValue: '' },
    ]
  },
  maps: {
    label: '🗺️ Bản Đồ Thế Giới (maps)',
    shortLabel: 'Bản Đồ (Maps)',
    primaryKey: ['id'],
    displayColumns: [
      { key: 'id', label: 'ID Map', width: '80px' },
      { key: 'name', label: 'Tên bản đồ' },
      { key: 'level', label: 'Cấp độ map', width: '90px' },
      { key: 'maxzone', label: 'Số khu tối đa', width: '100px' },
      { key: 'maxplayer', label: 'Số người/khu', width: '100px' },
      { key: 'boat', label: 'Loại tàu bè', width: '90px' },
    ],
    fields: [
      { key: 'id', label: 'ID Map (Bắt buộc)', type: 'number', required: true },
      { key: 'name', label: 'Tên bản đồ', type: 'text', required: true },
      { key: 'level', label: 'Cấp độ yêu cầu', type: 'number', defaultValue: 1 },
      { key: 'maxzone', label: 'Số khu tối đa', type: 'number', defaultValue: 15 },
      { key: 'maxplayer', label: 'Số người tối đa mỗi khu', type: 'number', defaultValue: 25 },
      { key: 'npcs', label: 'NPCs trong Map (JSON)', type: 'text', defaultValue: '[]' },
      { key: 'mobs', label: 'Quái trong Map (JSON)', type: 'text', defaultValue: '[]' },
      { key: 'boat', label: 'Cấu hình thuyền (JSON)', type: 'text', defaultValue: '[]' },
    ]
  },
  mobs: {
    label: '👾 Quái & Quái Tinh Anh (mobs)',
    shortLabel: 'Quái (Mobs)',
    primaryKey: ['id'],
    displayColumns: [
      { key: 'id', label: 'ID Quái', width: '80px' },
      { key: 'name', label: 'Tên quái' },
      { key: 'level', label: 'Cấp độ', width: '80px' },
      { key: 'hp', label: 'Máu tối đa (HP)' },
      { key: 'typelive', label: 'Loại sống', width: '90px' },
      { key: 'isMonster', label: 'Là Boss/Monster', width: '110px' },
    ],
    fields: [
      { key: 'id', label: 'ID Quái (Bắt buộc)', type: 'number', required: true },
      { key: 'name', label: 'Tên quái', type: 'text', required: true },
      { key: 'level', label: 'Cấp độ', type: 'number', defaultValue: 1 },
      { key: 'hp', label: 'Lượng máu (HP)', type: 'number', defaultValue: 1000 },
      { key: 'typelive', label: 'Loại (0: Thường, 1: Bay, 5: Boss...)', type: 'number', defaultValue: 0 },
      { key: 'typeMove', label: 'Kiểu di chuyển', type: 'number', defaultValue: 0 },
      { key: 'isMonster', label: 'Thuộc tính Boss (0: Thường, 1: Tinh anh, 2: Thủ lĩnh)', type: 'number', defaultValue: 0 },
    ]
  },
  boss: {
    label: '👹 Boss Thế Giới (boss)',
    shortLabel: 'Boss (Boss)',
    primaryKey: ['id'],
    displayColumns: [
      { key: 'id', label: 'ID Boss', width: '80px' },
      { key: 'mob_id', label: 'Mob ID', width: '90px' },
      { key: 'site', label: 'Vị trí tọa độ (Site)' },
      { key: 'hp', label: 'Lượng HP' },
      { key: 'level', label: 'Cấp độ', width: '80px' },
      { key: 'thegioi', label: 'Thế giới', width: '80px' },
    ],
    fields: [
      { key: 'id', label: 'ID Boss (Bắt buộc)', type: 'number', required: true },
      { key: 'mob_id', label: 'ID Quái gốc (mobs.id)', type: 'number', required: true },
      { key: 'site', label: 'Vị trí tọa độ (JSON [map, x, y])', type: 'text', defaultValue: '[1, 300, 300]' },
      { key: 'hp', label: 'Lượng máu Boss', type: 'number', defaultValue: 10000000 },
      { key: 'skill', label: 'Kỹ năng Boss dùng (JSON)', type: 'text', defaultValue: '[]' },
      { key: 'buff', label: 'Hiệu ứng Buff (JSON)', type: 'text', defaultValue: '[]' },
      { key: 'level', label: 'Cấp độ', type: 'number', defaultValue: 99 },
      { key: 'thegioi', label: 'Thế giới (1, 2, 3...)', type: 'number', defaultValue: 2 },
    ]
  }
};

export default function AdminItems() {
  const { showMessage } = useOutletContext();

  const [activeTable, setActiveTable] = useState('item4');
  const [keyword, setKeyword] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Modal State
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | 'delete' | null
  const [formData, setFormData] = useState({});
  const [originalItem, setOriginalItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const currentConfig = TABLES_CONFIG[activeTable];

  // Khi đổi Tab: Reset kết quả tìm kiếm (tuân thủ tiêu chí: không hiển thị dữ liệu trước)
  const handleTabChange = (tableKey) => {
    setActiveTable(tableKey);
    setKeyword('');
    setItems([]);
    setTotal(0);
    setPage(1);
    setTotalPages(0);
    setSearchTriggered(false);
  };

  // Thực hiện tìm kiếm
  const handleSearch = async (e, searchPage = 1) => {
    if (e) e.preventDefault();
    const query = keyword.trim();
    if (!query) {
      showMessage('error', 'Vui lòng nhập ID hoặc Tên vật phẩm để tìm kiếm!');
      return;
    }

    setLoading(true);
    setSearchTriggered(true);
    setPage(searchPage);

    try {
      const res = await api.get('admin/items/search', {
        params: {
          table: activeTable,
          keyword: query,
          page: searchPage,
          limit: 15
        }
      });

      if (res.data && res.data.success) {
        setItems(res.data.data || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 0);
      } else {
        showMessage('error', res.data?.message || 'Lỗi khi tìm kiếm dữ liệu!');
      }
    } catch (err) {
      console.error('Error searching items:', err);
      showMessage('error', 'Lỗi kết nối máy chủ khi tìm kiếm!');
    } finally {
      setLoading(false);
    }
  };

  // Mở modal Thêm mới
  const handleOpenCreate = () => {
    const initData = {};
    currentConfig.fields.forEach(f => {
      initData[f.key] = f.defaultValue !== undefined ? f.defaultValue : '';
    });
    setFormData(initData);
    setOriginalItem(null);
    setModalMode('create');
  };

  // Mở modal Chỉnh sửa
  const handleOpenEdit = (item) => {
    setFormData({ ...item });
    setOriginalItem(item);
    setModalMode('edit');
  };

  // Mở modal Xóa
  const handleOpenDelete = (item) => {
    setOriginalItem(item);
    setModalMode('delete');
  };

  // Đóng modal
  const handleCloseModal = () => {
    setModalMode(null);
    setFormData({});
    setOriginalItem(null);
  };

  // Lưu Thêm mới / Chỉnh sửa
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (modalMode === 'create') {
        const res = await api.post('admin/items/create', {
          table: activeTable,
          itemData: formData
        });

        if (res.data && res.data.success) {
          showMessage('success', res.data.message || 'Thêm vật phẩm thành công!');
          handleCloseModal();
          if (searchTriggered) {
            handleSearch(null, page);
          }
        } else {
          showMessage('error', res.data?.message || 'Thêm thất bại!');
        }
      } else if (modalMode === 'edit') {
        const originalKey = {};
        currentConfig.primaryKey.forEach(pk => {
          originalKey[pk] = originalItem[pk];
        });

        const res = await api.post('admin/items/update', {
          table: activeTable,
          itemData: formData,
          originalKey
        });

        if (res.data && res.data.success) {
          showMessage('success', res.data.message || 'Cập nhật thành công!');
          handleCloseModal();
          if (searchTriggered) {
            handleSearch(null, page);
          }
        } else {
          showMessage('error', res.data?.message || 'Cập nhật thất bại!');
        }
      }
    } catch (err) {
      console.error('Submit error:', err);
      showMessage('error', 'Lỗi kết nối máy chủ!');
    } finally {
      setSubmitting(false);
    }
  };

  // Xác nhận Xóa
  const handleConfirmDelete = async () => {
    if (!originalItem) return;
    setSubmitting(true);

    try {
      const key = {};
      currentConfig.primaryKey.forEach(pk => {
        key[pk] = originalItem[pk];
      });

      const res = await api.post('admin/items/delete', {
        table: activeTable,
        key
      });

      if (res.data && res.data.success) {
        showMessage('success', res.data.message || 'Đã xóa bản ghi thành công!');
        handleCloseModal();
        if (searchTriggered) {
          handleSearch(null, page);
        }
      } else {
        showMessage('error', res.data?.message || 'Xóa thất bại!');
      }
    } catch (err) {
      console.error('Delete error:', err);
      showMessage('error', 'Lỗi kết nối máy chủ khi xóa!');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '22px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{
            margin: 0,
            fontSize: '22px',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #f8fafc 0%, #38bdf8 50%, #00d2ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.4px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>💎</span> QUẢN LÝ VẬT PHẨM & DỮ LIỆU GAME
          </h2>
          <p style={{ color: '#8294ae', margin: '6px 0 0 0', fontSize: '13.5px' }}>
            Tra cứu, thêm mới, chỉnh sửa và xóa dữ liệu trực tiếp trong 13 bảng Game Database (Trang bị, Dược phẩm, Thời trang, Pet, Danh hiệu, Kỹ năng, Bản đồ, Quái & Boss).
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontWeight: 'bold' }}
        >
          <span>➕</span> Thêm vào {currentConfig.shortLabel}
        </button>
      </div>

      {/* Tabs Selector for 9 Tables */}
      <div className="glass-panel" style={{ padding: '12px 15px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Object.keys(TABLES_CONFIG).map((tableKey) => {
            const cfg = TABLES_CONFIG[tableKey];
            const isActive = activeTable === tableKey;
            return (
              <button
                key={tableKey}
                onClick={() => handleTabChange(tableKey)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: isActive ? '1px solid #00d2ff' : '1px solid rgba(255,255,255,0.08)',
                  background: isActive ? 'linear-gradient(135deg, #0284c7 0%, #00d2ff 100%)' : 'rgba(255,255,255,0.03)',
                  color: isActive ? '#06101e' : '#8294ae',
                  fontSize: '13px',
                  fontWeight: isActive ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isActive ? '0 2px 10px rgba(0, 210, 255, 0.35)' : 'none'
                }}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Filter Box */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <form onSubmit={(e) => handleSearch(e, 1)} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <input
              type="text"
              placeholder={`🔍 Nhập ID hoặc Tên cần tìm trong ${currentConfig.shortLabel}...`}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="input"
              style={{
                width: '100%',
                padding: '12px 15px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 'bold', minWidth: '130px' }}
          >
            {loading ? '⏳ Đang tìm...' : '🔎 Tìm Kiếm'}
          </button>
          {searchTriggered && (
            <button
              type="button"
              onClick={() => {
                setKeyword('');
                setItems([]);
                setTotal(0);
                setSearchTriggered(false);
              }}
              className="btn btn-outline"
              style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#bbb' }}
            >
              ✕ Xóa tìm kiếm
            </button>
          )}
        </form>
      </div>

      {/* Data Table / Empty State Area */}
      <div className="glass-panel" style={{ padding: '20px', minHeight: '300px' }}>
        {!searchTriggered ? (
          /* Initial State: Prompt user to search (No pre-loaded data) */
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔍</div>
            <h3 style={{ color: '#ccc', margin: '0 0 8px 0', fontSize: '18px' }}>Chưa có kết quả tìm kiếm</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#777' }}>
              Hãy nhập <strong>ID</strong> hoặc <strong>Tên vật phẩm</strong> vào ô tìm kiếm ở trên và bấm <strong>Tìm Kiếm</strong> để tra cứu dữ liệu trong bảng <code>{activeTable}</code>.
            </p>
          </div>
        ) : loading ? (
          /* Loading State */
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#00d2ff' }}>
            <div className="loader" style={{ margin: '0 auto 15px auto' }}></div>
            <p style={{ margin: 0, fontSize: '14px' }}>Đang tìm kiếm dữ liệu trong bảng {activeTable}...</p>
          </div>
        ) : items.length === 0 ? (
          /* No Results Found */
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
            <div style={{ fontSize: '42px', marginBottom: '15px' }}>❌</div>
            <h3 style={{ color: '#f43f5e', margin: '0 0 8px 0', fontSize: '17px' }}>Không tìm thấy kết quả phù hợp!</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#777' }}>
              Không có vật phẩm nào khớp với từ khóa "<strong>{keyword}</strong>" trong bảng <code>{activeTable}</code>.
            </p>
          </div>
        ) : (
          /* Search Results Table */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ color: '#cbd5e1', fontSize: '14px' }}>
                Tìm thấy <strong style={{ color: '#00d2ff' }}>{total}</strong> kết quả cho "<strong>{keyword}</strong>"
              </span>
              <span style={{ color: '#8294ae', fontSize: '13px' }}>
                Trang <strong style={{ color: '#00d2ff' }}>{page}</strong> / {totalPages}
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.12)', color: '#888', textAlign: 'left' }}>
                    {currentConfig.displayColumns.map((col) => (
                      <th key={col.key} style={{ padding: '12px 10px', width: col.width || 'auto', whiteSpace: 'nowrap' }}>
                        {col.label}
                      </th>
                    ))}
                    <th style={{ padding: '12px 10px', textAlign: 'center', width: '120px' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        color: '#ddd',
                        background: idx % 2 === 1 ? 'rgba(255,255,255,0.015)' : 'transparent'
                      }}
                    >
                      {currentConfig.displayColumns.map((col) => {
                        let val = item[col.key];
                        if (val === null || val === undefined) val = <span style={{ color: '#555' }}>-</span>;
                        else if (typeof val === 'object') val = JSON.stringify(val);
                        else if (typeof val === 'string' && val.length > 50) val = val.substring(0, 50) + '...';

                        return (
                          <td key={col.key} style={{ padding: '10px', whiteSpace: col.key === 'name' ? 'normal' : 'nowrap' }}>
                            {col.key === 'id' ? (
                              <span style={{ color: '#ffac30', fontWeight: 'bold' }}>#{item.id}</span>
                            ) : col.key === 'name' ? (
                              <strong style={{ color: '#fff' }}>{item.name}</strong>
                            ) : (
                              val
                            )}
                          </td>
                        );
                      })}
                      <td style={{ padding: '10px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          style={{
                            padding: '5px 10px',
                            marginRight: '6px',
                            background: 'rgba(24,144,255,0.15)',
                            border: '1px solid rgba(24,144,255,0.3)',
                            borderRadius: '4px',
                            color: '#1890ff',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                          title="Chỉnh sửa vật phẩm"
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          onClick={() => handleOpenDelete(item)}
                          style={{
                            padding: '5px 10px',
                            background: 'rgba(245,34,45,0.15)',
                            border: '1px solid rgba(245,34,45,0.3)',
                            borderRadius: '4px',
                            color: '#ff4d4f',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                          title="Xóa vật phẩm"
                        >
                          🗑️ Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <button
                  disabled={page <= 1}
                  onClick={() => handleSearch(null, page - 1)}
                  className="btn btn-outline"
                  style={{ padding: '6px 12px', fontSize: '12px', opacity: page <= 1 ? 0.4 : 1 }}
                >
                  ◀ Trang trước
                </button>
                <span style={{ color: '#bbb', fontSize: '13px', padding: '0 10px' }}>
                  Trang <strong style={{ color: '#ff3366' }}>{page}</strong> / {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => handleSearch(null, page + 1)}
                  className="btn btn-outline"
                  style={{ padding: '6px 12px', fontSize: '12px', opacity: page >= totalPages ? 0.4 : 1 }}
                >
                  Trang sau ▶
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* MODAL: THÊM MỚI / CHỈNH SỬA VẬT PHẨM       */}
      {/* ========================================== */}
      {(modalMode === 'create' || modalMode === 'edit') && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              background: '#1a1a1a',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '650px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#ff3366', fontSize: '18px' }}>
                {modalMode === 'create' ? `➕ Thêm Mới Vào ${currentConfig.shortLabel}` : `✏️ Chỉnh Sửa ${currentConfig.shortLabel} #${originalItem?.id}`}
              </h3>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '20px', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1, padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '15px' }}>
                {currentConfig.fields.map((f) => (
                  <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: f.type === 'textarea' || f.key.startsWith('op') || f.key.startsWith('info') || f.key.startsWith('limit_data') ? '1 / -1' : 'auto' }}>
                    <label style={{ color: '#ccc', fontSize: '12px', fontWeight: 'bold' }}>
                      {f.label} {f.required && <span style={{ color: '#ff4d79' }}>*</span>}
                    </label>
                    {f.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        value={formData[f.key] ?? ''}
                        onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                        required={f.required}
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: 'rgba(0,0,0,0.4)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          borderRadius: '4px',
                          color: '#fff',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    ) : (
                      <input
                        type={f.type === 'number' ? 'number' : 'text'}
                        value={formData[f.key] ?? ''}
                        onChange={(e) => setFormData({ ...formData, [f.key]: f.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value })}
                        required={f.required}
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: 'rgba(0,0,0,0.4)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          borderRadius: '4px',
                          color: '#fff',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    )}
                    {f.helper && <span style={{ color: '#777', fontSize: '11px' }}>💡 {f.helper}</span>}
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '25px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <button type="button" onClick={handleCloseModal} className="btn btn-outline" style={{ borderColor: '#555', color: '#ccc' }}>
                  Hủy Bỏ
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting} style={{ minWidth: '120px', fontWeight: 'bold' }}>
                  {submitting ? '⏳ Đang lưu...' : modalMode === 'create' ? 'Thêm Mới' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: XÁC NHẬN XÓA VẬT PHẨM               */}
      {/* ========================================== */}
      {modalMode === 'delete' && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              background: '#1f1619',
              border: '1px solid rgba(255,51,102,0.3)',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '440px',
              padding: '25px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.9)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '42px', marginBottom: '12px' }}>⚠️</div>
            <h3 style={{ color: '#ff4d79', margin: '0 0 10px 0', fontSize: '18px' }}>Xác Nhận Xóa Vật Phẩm</h3>
            <p style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.5', margin: '0 0 20px 0' }}>
              Bạn có chắc chắn muốn xóa bản ghi <strong>#{originalItem?.id} {originalItem?.name ? `(${originalItem?.name})` : ''}</strong> khỏi bảng <code>{activeTable}</code> không?
              <br />
              <span style={{ color: '#888', fontSize: '12px' }}>Hành động này sẽ xóa vĩnh viễn dữ liệu trong database!</span>
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button onClick={handleCloseModal} className="btn btn-outline" style={{ borderColor: '#555', color: '#ccc' }}>
                Hủy Bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={submitting}
                style={{
                  padding: '10px 20px',
                  background: '#ff4d4f',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {submitting ? '⏳ Đang xóa...' : '🗑️ Đồng Ý Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
