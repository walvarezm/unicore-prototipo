
const LOCAL_STORAGE_GESTION_CHEQUES = 'gestionCheques';  

// Initialize data storage
if (!localStorage.getItem(LOCAL_STORAGE_GESTION_CHEQUES)) {
    const initialData = [
        {
            id: 1,
            referencia: 'SOL-2024-001',
            fecha: '2024-01-15',
            numeroCuenta: '1234567890',
            tipoCuenta: 'Cuenta Corriente',
            titular: 'MARIA RODRIGUEZ LOPEZ',
            cantidad: 50,
            tipoChequera: 'Estándar',
            direccionEntrega: 'Av. Principal #123, Ciudad',
            estado: 'Pendiente',
            fechaCreacion: new Date().toISOString(),
            observaciones: 'Solicitud urgente para fin de mes'
        },
        {
            id: 2,
            referencia: 'SOL-2024-002',
            fecha: '2024-01-14',
            numeroCuenta: '0987654321',
            tipoCuenta: 'Cuenta de Ahorros',
            titular: 'CARLOS MARTINEZ SILVA',
            cantidad: 25,
            tipoChequera: 'Ejecutiva',
            direccionEntrega: 'Calle Secundaria #456, Ciudad',
            estado: 'Aprobado',
            fechaCreacion: new Date().toISOString(),
            observaciones: 'Cliente VIP'
        },
        {
            id: 3,
            referencia: 'SOL-2024-003',
            fecha: '2024-01-13',
            numeroCuenta: '1122334455',
            tipoCuenta: 'Cuenta Corriente',
            titular: 'ANA PATRICIA GOMEZ',
            cantidad: 100,
            tipoChequera: 'Personalizada',
            direccionEntrega: 'Plaza Central #789, Ciudad',
            estado: 'Completado',
            fechaCreacion: new Date().toISOString(),
            observaciones: 'Entrega programada para mañana'
        }
    ];
    localStorage.setItem(LOCAL_STORAGE_GESTION_CHEQUES, JSON.stringify(initialData));
}

            // Current data and pagination
            let currentData = [];
            let filteredData = [];
            let currentPage = 1;
            let itemsPerPage = 5;








            // Load CRUD for Solicitudes de Cheques
            function loadSolicitudesChequesCRUD() {
                // Panel 2 - Search/Filter
                $('#panel2Content').html(`
                    <form class="search-form" id="searchForm">
                        <div class="form-group">
                            <label>Referencia:</label>
                            <input type="text" id="searchReferencia" placeholder="SOL-2024-001">
                        </div>
                        <div class="form-group">
                            <label>Número de Cuenta:</label>
                            <input type="text" id="searchCuenta" placeholder="1234567890">
                        </div>
                        <div class="form-group">
                            <label>Titular:</label>
                            <input type="text" id="searchTitular" placeholder="Nombre del titular">
                        </div>
                        <div class="form-group">
                            <label>Estado:</label>
                            <select id="searchEstado">
                                <option value="">Todos los estados</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Aprobado">Aprobado</option>
                                <option value="Completado">Completado</option>
                                <option value="Rechazado">Rechazado</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Fecha Desde:</label>
                            <input type="date" id="searchFechaDesde">
                        </div>
                        <div class="form-group">
                            <label>Fecha Hasta:</label>
                            <input type="date" id="searchFechaHasta">
                        </div>
                        <div class="search-actions">
                            <button type="button" class="btn btn-primary" onclick="searchSolicitudes()">🔍 Buscar</button>
                            <button type="button" class="btn btn-secondary" onclick="clearSearch()">🗑️ Limpiar</button>
                            <button type="button" class="btn btn-info" onclick="exportData()">📊 Exportar</button>
                        </div>
                    </form>
                `);

                // Panel 3 - Data List
                $('#panel3Title').text('📋 Solicitudes de Cheques');
                $('#panel3Actions').html(`
                    <button class="btn btn-success" onclick="openCreateModal()">➕ Nueva Solicitud</button>
                    <button class="btn btn-info" onclick="refreshData()">🔄 Actualizar</button>
                `);

                loadSolicitudesData();
            }

            // Load solicitudes data
            function loadSolicitudesData() {
                currentData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_GESTION_CHEQUES) || '[]');
                filteredData = [...currentData];
                renderSolicitudesTable();
            }

            // Render solicitudes table
            function renderSolicitudesTable() {
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const pageData = filteredData.slice(startIndex, endIndex);

                let tableHTML = `
                    <div style="margin-bottom: 15px;">
                        <span>Mostrando ${startIndex + 1}-${Math.min(endIndex, filteredData.length)} de ${filteredData.length} registros</span>
                    </div>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Referencia</th>
                                <th>Fecha</th>
                                <th>Cuenta</th>
                                <th>Titular</th>
                                <th>Cantidad</th>
                                <th>Tipo</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                pageData.forEach(solicitud => {
                    const statusClass = getStatusClass(solicitud.estado);
                    tableHTML += `
                        <tr>
                            <td><strong>${solicitud.referencia}</strong></td>
                            <td>${solicitud.fecha}</td>
                            <td>${solicitud.numeroCuenta}</td>
                            <td>${solicitud.titular}</td>
                            <td>${solicitud.cantidad}</td>
                            <td>${solicitud.tipoChequera}</td>
                            <td><span class="status-badge ${statusClass}">${solicitud.estado}</span></td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="viewSolicitud(${solicitud.id})">👁️ Ver</button>
                                <button class="btn btn-sm btn-warning" onclick="editSolicitud(${solicitud.id})">✏️ Editar</button>
                                <button class="btn btn-sm btn-danger" onclick="deleteSolicitud(${solicitud.id})">🗑️ Eliminar</button>
                            </td>
                        </tr>
                    `;
                });

                tableHTML += `
                        </tbody>
                    </table>
                `;

                // Add pagination
                tableHTML += renderPagination();

                $('#content-panel-3').html(tableHTML);
            }





            // Render pagination
            function renderPagination() {
                const totalPages = Math.ceil(filteredData.length / itemsPerPage);
                if (totalPages <= 1) return '';

                let paginationHTML = '<div class="pagination">';
                
                // Previous button
                paginationHTML += `<button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>« Anterior</button>`;
                
                // Page numbers
                for (let i = 1; i <= totalPages; i++) {
                    if (i === currentPage) {
                        paginationHTML += `<button class="active">${i}</button>`;
                    } else if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                        paginationHTML += `<button onclick="changePage(${i})">${i}</button>`;
                    } else if (i === currentPage - 3 || i === currentPage + 3) {
                        paginationHTML += `<span>...</span>`;
                    }
                }
                
                // Next button
                paginationHTML += `<button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Siguiente »</button>`;
                
                paginationHTML += '</div>';
                return paginationHTML;
            }

            // Global functions
            window.changePage = function(page) {
                const totalPages = Math.ceil(filteredData.length / itemsPerPage);
                if (page >= 1 && page <= totalPages) {
                    currentPage = page;
                    renderSolicitudesTable();
                }
            };

            window.searchSolicitudes = function() {
                const referencia = $('#searchReferencia').val().toLowerCase();
                const cuenta = $('#searchCuenta').val().toLowerCase();
                const titular = $('#searchTitular').val().toLowerCase();
                const estado = $('#searchEstado').val();
                const fechaDesde = $('#searchFechaDesde').val();
                const fechaHasta = $('#searchFechaHasta').val();

                filteredData = currentData.filter(solicitud => {
                    let matches = true;
                    
                    if (referencia && !solicitud.referencia.toLowerCase().includes(referencia)) matches = false;
                    if (cuenta && !solicitud.numeroCuenta.includes(cuenta)) matches = false;
                    if (titular && !solicitud.titular.toLowerCase().includes(titular)) matches = false;
                    if (estado && solicitud.estado !== estado) matches = false;
                    if (fechaDesde && solicitud.fecha < fechaDesde) matches = false;
                    if (fechaHasta && solicitud.fecha > fechaHasta) matches = false;
                    
                    return matches;
                });

                currentPage = 1;
                renderSolicitudesTable();
                showAlert('Búsqueda realizada. ' + filteredData.length + ' registros encontrados.', 'info');
            };

            window.clearSearch = function() {
                $('#searchForm')[0].reset();
                filteredData = [...currentData];
                currentPage = 1;
                renderSolicitudesTable();
                showAlert('Filtros limpiados.', 'info');
            };

            window.refreshData = function() {
                loadSolicitudesData();
                showAlert('Datos actualizados.', 'success');
            };

            window.exportData = function() {
                const csvContent = generateCSV(filteredData);
                downloadCSV(csvContent, 'solicitudes_cheques.csv');
                showAlert('Datos exportados exitosamente.', 'success');
            };

            // CRUD Operations
            window.openCreateModal = function() {
                showSolicitudModal('create');
            };

            window.viewSolicitud = function(id) {
                const solicitud = currentData.find(s => s.id === id);
                if (solicitud) {
                    showSolicitudModal('view', solicitud);
                }
            };

            window.editSolicitud = function(id) {
                const solicitud = currentData.find(s => s.id === id);
                if (solicitud) {
                    showSolicitudModal('edit', solicitud);
                }
            };

            window.deleteSolicitud = function(id) {
                const solicitud = currentData.find(s => s.id === id);
                if (solicitud) {
                    showConfirmModal(
                        'Confirmar Eliminación',
                        `¿Está seguro que desea eliminar la solicitud ${solicitud.referencia}?`,
                        () => {
                            currentData = currentData.filter(s => s.id !== id);
                            localStorage.setItem(LOCAL_STORAGE_GESTION_CHEQUES, JSON.stringify(currentData));
                            loadSolicitudesData();
                            showAlert('Solicitud eliminada exitosamente.', 'success');
                            closeModal('-confirm');
                        }
                    );
                }
            };

            // Show solicitud modal
            function showSolicitudModal(mode, solicitud = null) {
                const isView = mode === 'view';
                const isEdit = mode === 'edit';
                const isCreate = mode === 'create';

                const title = isView ? 'Ver Solicitud' : isEdit ? 'Editar Solicitud' : 'Nueva Solicitud';
                
                $('#modal-title').text(title);
                
                const modalBody = `
                    <form id="solicitudForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Referencia:</label>
                                <input type="text" id="referencia" value="${solicitud?.referencia || ''}" ${isView || isEdit ? 'readonly' : ''} required>
                            </div>
                            <div class="form-group">
                                <label>Fecha:</label>
                                <input type="date" id="fecha" value="${solicitud?.fecha || new Date().toISOString().split('T')[0]}" ${isView ? 'readonly' : ''} required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Número de Cuenta:</label>
                                <input type="text" id="numeroCuenta" value="${solicitud?.numeroCuenta || ''}" ${isView ? 'readonly' : ''} required>
                            </div>
                            <div class="form-group">
                                <label>Tipo de Cuenta:</label>
                                <select id="tipoCuenta" ${isView ? 'disabled' : ''} required>
                                    <option value="">Seleccione...</option>
                                    <option value="Cuenta Corriente" ${solicitud?.tipoCuenta === 'Cuenta Corriente' ? 'selected' : ''}>Cuenta Corriente</option>
                                    <option value="Cuenta de Ahorros" ${solicitud?.tipoCuenta === 'Cuenta de Ahorros' ? 'selected' : ''}>Cuenta de Ahorros</option>
                                    <option value="Chequera de Gerencia La Paz M/N" ${solicitud?.tipoCuenta === 'Chequera de Gerencia La Paz M/N' ? 'selected' : ''}>Chequera de Gerencia La Paz M/N</option>
                                    <option value="Chequera de Gerencia La Paz M/E" ${solicitud?.tipoCuenta === 'Chequera de Gerencia La Paz M/E' ? 'selected' : ''}>Chequera de Gerencia La Paz M/E</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Titular:</label>
                            <input type="text" id="titular" value="${solicitud?.titular || ''}" ${isView ? 'readonly' : ''} required>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Cantidad de Cheques:</label>
                                <select id="cantidad" ${isView ? 'disabled' : ''} required>
                                    <option value="">Seleccione...</option>
                                    <option value="25" ${solicitud?.cantidad == 25 ? 'selected' : ''}>25 Cheques</option>
                                    <option value="50" ${solicitud?.cantidad == 50 ? 'selected' : ''}>50 Cheques</option>
                                    <option value="100" ${solicitud?.cantidad == 100 ? 'selected' : ''}>100 Cheques</option>
                                    
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Tipo de Chequera:</label>
                                <select id="tipoChequera" ${isView ? 'disabled' : ''} required>
                                    <option value="">Seleccione...</option>
                                    <option value="Estándar" ${solicitud?.tipoChequera === 'Estándar' ? 'selected' : ''}>Estándar</option>
                                    <option value="Ejecutiva" ${solicitud?.tipoChequera === 'Ejecutiva' ? 'selected' : ''}>Ejecutiva</option>
                                    <option value="Personalizada" ${solicitud?.tipoChequera === 'Personalizada' ? 'selected' : ''}>Personalizada</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Dirección de Entrega:</label>
                            <textarea id="direccionEntrega" rows="3" ${isView ? 'readonly' : ''} required>${solicitud?.direccionEntrega || ''}</textarea>
                        </div>
                        ${isEdit || isView ? `
                        <div class="form-group">
                            <label>Estado:</label>
                            <select id="estado" ${isView ? 'disabled' : ''}>
                                <option value="Pendiente" ${solicitud?.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                                <option value="Aprobado" ${solicitud?.estado === 'Aprobado' ? 'selected' : ''}>Aprobado</option>
                                <option value="Completado" ${solicitud?.estado === 'Completado' ? 'selected' : ''}>Completado</option>
                                <option value="Rechazado" ${solicitud?.estado === 'Rechazado' ? 'selected' : ''}>Rechazado</option>
                            </select>
                        </div>
                        ` : ''}
                        <div class="form-group">
                            <label>Observaciones:</label>
                            <textarea id="observaciones" rows="3" ${isView ? 'readonly' : ''}>${solicitud?.observaciones || ''}</textarea>
                        </div>
                    </form>
                `;

                $('#modal-body').html(modalBody);

                let footerButtons = '';
                if (isView) {
                    footerButtons = '<button class="btn btn-secondary" onclick="closeModal()">Cerrar</button>';
                } else if (isEdit) {
                    footerButtons = `
                        <button class="btn btn-primary" onclick="saveSolicitud(${solicitud.id})">💾 Guardar Cambios</button>
                        <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
                    `;
                } else {
                    footerButtons = `
                        <button class="btn btn-primary" onclick="createSolicitud()">➕ Crear Solicitud</button>
                        <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
                    `;
                }

                $('#modal-footer').html(footerButtons);

                // Generate reference for new solicitudes
                if (isCreate) {
                    const nextId = Math.max(...currentData.map(s => s.id), 0) + 1;
                    $('#referencia').val(`SOL-2024-${String(nextId).padStart(3, '0')}`);
                }

                $('#modal').show();
            }

            // Create solicitud
            window.createSolicitud = function() {
                if (validateSolicitudForm()) {
                    const newSolicitud = {
                        id: Math.max(...currentData.map(s => s.id), 0) + 1,
                        referencia: $('#referencia').val(),
                        fecha: $('#fecha').val(),
                        numeroCuenta: $('#numeroCuenta').val(),
                        tipoCuenta: $('#tipoCuenta').val(),
                        titular: $('#titular').val(),
                        cantidad: parseInt($('#cantidad').val()),
                        tipoChequera: $('#tipoChequera').val(),
                        direccionEntrega: $('#direccionEntrega').val(),
                        estado: 'Pendiente',
                        fechaCreacion: new Date().toISOString(),
                        observaciones: $('#observaciones').val()
                    };

                    currentData.push(newSolicitud);
                    localStorage.setItem(LOCAL_STORAGE_GESTION_CHEQUES, JSON.stringify(currentData));
                    loadSolicitudesData();
                    closeModal();
                    showAlert('Solicitud creada exitosamente.', 'success');
                }
            };

            // Save solicitud
            window.saveSolicitud = function(id) {
                if (validateSolicitudForm()) {
                    const index = currentData.findIndex(s => s.id === id);
                    if (index !== -1) {
                        currentData[index] = {
                            ...currentData[index],
                            fecha: $('#fecha').val(),
                            numeroCuenta: $('#numeroCuenta').val(),
                            tipoCuenta: $('#tipoCuenta').val(),
                            titular: $('#titular').val(),
                            cantidad: parseInt($('#cantidad').val()),
                            tipoChequera: $('#tipoChequera').val(),
                            direccionEntrega: $('#direccionEntrega').val(),
                            estado: $('#estado').val(),
                            observaciones: $('#observaciones').val()
                        };

                        localStorage.setItem(LOCAL_STORAGE_GESTION_CHEQUES, JSON.stringify(currentData));
                        loadSolicitudesData();
                        closeModal();
                        showAlert('Solicitud actualizada exitosamente.', 'success');
                    }
                }
            };

            // Validate form
            function validateSolicitudForm() {
                const requiredFields = ['referencia', 'fecha', 'numeroCuenta', 'tipoCuenta', 'titular', 'cantidad', 'tipoChequera', 'direccionEntrega'];
                let isValid = true;

                requiredFields.forEach(field => {
                    const value = $(`#${field}`).val();
                    if (!value || value.trim() === '') {
                        $(`#${field}`).css('border-color', '#dc3545');
                        isValid = false;
                    } else {
                        $(`#${field}`).css('border-color', '#28a745');
                    }
                });

                if (!isValid) {
                    showAlert('Por favor complete todos los campos requeridos.', 'danger');
                }

                return isValid;
            }


            function generateCSV(data) {
                const headers = ['Referencia', 'Fecha', 'Cuenta', 'Tipo Cuenta', 'Titular', 'Cantidad', 'Tipo Chequera', 'Estado', 'Observaciones'];
                let csv = headers.join(',') + '\n';
                
                data.forEach(row => {
                    const values = [
                        row.referencia,
                        row.fecha,
                        row.numeroCuenta,
                        row.tipoCuenta,
                        row.titular,
                        row.cantidad,
                        row.tipoChequera,
                        row.estado,
                        row.observaciones
                    ];
                    csv += values.map(v => `"${v}"`).join(',') + '\n';
                });
                
                return csv;
            }

            function downloadCSV(content, filename) {
                const blob = new Blob([content], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);
            }            