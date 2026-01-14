/**
 * TileMap - Tile-based map rendering system
 */
export class TileMap {
    constructor(tileSize = 64) {
        this.tileSize = tileSize;
        this.tiles = [];
        this.width = 0;
        this.height = 0;
        this.tileSets = {}; // Map of tile set names to images/sprite sheets
    }
    
    /**
     * Set tile map dimensions
     */
    setDimensions(width, height) {
        this.width = width;
        this.height = height;
        this.tiles = new Array(width * height).fill(0);
    }
    
    /**
     * Set tile at position
     */
    setTile(x, y, tileId) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.tiles[y * this.width + x] = tileId;
        }
    }
    
    /**
     * Get tile at position
     */
    getTile(x, y) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            return this.tiles[y * this.width + x];
        }
        return 0;
    }
    
    /**
     * Register a tile set
     */
    registerTileSet(name, image, tileWidth = null, tileHeight = null) {
        this.tileSets[name] = {
            image: image,
            tileWidth: tileWidth || this.tileSize,
            tileHeight: tileHeight || this.tileSize,
            tilesPerRow: image ? Math.floor(image.width / (tileWidth || this.tileSize)) : 0
        };
    }
    
    /**
     * Render visible tiles
     */
    render(ctx, camera, tileSetName = 'default') {
        const tileSet = this.tileSets[tileSetName];
        if (!tileSet || !tileSet.image) return;
        
        const tileSize = this.tileSize;
        const startX = Math.max(0, Math.floor((camera.x - camera.width / 2 / camera.zoom) / tileSize));
        const startY = Math.max(0, Math.floor((camera.y - camera.height / 2 / camera.zoom) / tileSize));
        const endX = Math.min(this.width - 1, Math.ceil((camera.x + camera.width / 2 / camera.zoom) / tileSize));
        const endY = Math.min(this.height - 1, Math.ceil((camera.y + camera.height / 2 / camera.zoom) / tileSize));
        
        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                const tileId = this.getTile(x, y);
                if (tileId > 0) {
                    const screenPos = camera.worldToScreen(x * tileSize, y * tileSize);
                    this.renderTile(ctx, tileSet, tileId, screenPos.x, screenPos.y, tileSize);
                }
            }
        }
    }
    
    /**
     * Render a single tile
     */
    renderTile(ctx, tileSet, tileId, x, y, size) {
        const tileWidth = tileSet.tileWidth;
        const tileHeight = tileSet.tileHeight;
        const tilesPerRow = tileSet.tilesPerRow;
        
        // Calculate source position in tile set
        const tileIndex = tileId - 1; // Tile IDs are 1-based
        const srcX = (tileIndex % tilesPerRow) * tileWidth;
        const srcY = Math.floor(tileIndex / tilesPerRow) * tileHeight;
        
        ctx.drawImage(
            tileSet.image,
            srcX,
            srcY,
            tileWidth,
            tileHeight,
            x,
            y,
            size,
            size
        );
    }
    
    /**
     * Fill area with tile
     */
    fillArea(x1, y1, x2, y2, tileId) {
        for (let y = y1; y <= y2; y++) {
            for (let x = x1; x <= x2; x++) {
                this.setTile(x, y, tileId);
            }
        }
    }
}

