/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/rest-api/src/app/app.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = exports.mongoDbUri = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const core_1 = __webpack_require__("@nestjs/core");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const logging_config_1 = __webpack_require__("./apps/rest-api/src/app/common/logging.config.ts");
const equipe_module_1 = __webpack_require__("./apps/rest-api/src/app/equipe/equipe.module.ts");
const match_module_1 = __webpack_require__("./apps/rest-api/src/app/match/match.module.ts");
const nest_winston_1 = __webpack_require__("nest-winston");
const config_1 = __webpack_require__("@nestjs/config");
const environment_1 = __webpack_require__("./apps/rest-api/src/environments/environment.ts");
const client_cache_interceptor_1 = __webpack_require__("./apps/rest-api/src/app/client-cache.interceptor.ts");
const mongoDbUri = function (configService) {
    const username = configService.get('DATABASE_USERNAME');
    const password = configService.get('DATABASE_PASSWORD');
    const host = configService.get('DATABASE_HOST');
    const databaseName = configService.get('DATABASE_NAME');
    return {
        uri: `mongodb+srv://${username}:${password}@${host}/${databaseName}`,
    };
};
exports.mongoDbUri = mongoDbUri;
let AppModule = class AppModule {
};
AppModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: environment_1.environment.filePath,
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: exports.mongoDbUri,
                inject: [config_1.ConfigService],
            }),
            nest_winston_1.WinstonModule.forRoot(logging_config_1.winstonConfig),
            equipe_module_1.EquipeModule,
            match_module_1.MatchModule,
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_PIPE,
                useClass: common_1.ValidationPipe,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: client_cache_interceptor_1.ClientCacheInterceptor
            }
        ],
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),

/***/ "./apps/rest-api/src/app/client-cache.interceptor.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientCacheInterceptor = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
let ClientCacheInterceptor = class ClientCacheInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        if (request.method === 'GET') {
            response.header('cache-control', 'max-age=30');
        }
        return next.handle();
    }
};
ClientCacheInterceptor = tslib_1.__decorate([
    common_1.Injectable()
], ClientCacheInterceptor);
exports.ClientCacheInterceptor = ClientCacheInterceptor;


/***/ }),

/***/ "./apps/rest-api/src/app/common/logging.config.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.winstonConfig = void 0;
const winston_1 = __webpack_require__("winston");
const colorizer = winston_1.format.colorize();
const processIdFormat = winston_1.format((info) => {
    info.processId = colorizer.colorize(info.level, `[NEST] ${process.pid}`);
    return info;
});
const levelFormat = winston_1.format((info) => {
    info.level = colorizer.colorize(info.level, info.level.toLocaleUpperCase());
    return info;
});
const contextFormat = winston_1.format((info) => {
    info.context = colorizer.colorize('warn', `[${info.context || ''}]`);
    return info;
});
const messageFormat = winston_1.format((info) => {
    info.message = colorizer.colorize(info.level, info.message);
    return info;
});
const msFormat = winston_1.format((info) => {
    info.ms = colorizer.colorize('warn', info.ms);
    return info;
});
exports.winstonConfig = {
    transports: [
        new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.timestamp({ format: 'dd/MM/YYYY, hh:mm:ss' }), winston_1.format.ms(), processIdFormat(), contextFormat(), messageFormat(), msFormat(), levelFormat(), winston_1.format.printf((info) => {
                return `${info.processId} ${info.timestamp} ${info.level} ${info.context} ${info.message} ${info.ms}`;
            })),
        }),
        new winston_1.transports.File({
            level: 'debug',
            format: winston_1.format.combine(winston_1.format.ms(), winston_1.format.timestamp(), winston_1.format.json()),
            filename: 'rest-api.debug.log',
        }),
        new winston_1.transports.File({
            level: 'info',
            format: winston_1.format.combine(winston_1.format.ms(), winston_1.format.timestamp(), winston_1.format.colorize(), winston_1.format.json()),
            filename: 'rest-api.error.log',
        }),
        new winston_1.transports.File({
            level: 'error',
            format: winston_1.format.combine(winston_1.format.ms(), winston_1.format.timestamp(), winston_1.format.colorize(), winston_1.format.json()),
            filename: 'rest-api.error.log',
        }),
    ],
};


/***/ }),

/***/ "./apps/rest-api/src/app/equipe/equipe.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EquipeController = exports.PaginationParamsValidation = exports.PostParamsValidation = void 0;
const tslib_1 = __webpack_require__("tslib");
const id_1 = __webpack_require__("./libs/api/validation/id/src/index.ts");
const equipe_1 = __webpack_require__("./libs/common/resource/equipe/src/index.ts");
const common_1 = __webpack_require__("@nestjs/common");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const equipe_documentation_1 = __webpack_require__("./apps/rest-api/src/app/equipe/equipe.documentation.ts");
const equipe_service_1 = __webpack_require__("./apps/rest-api/src/app/equipe/equipe.service.ts");
const equipe_validation_1 = __webpack_require__("./apps/rest-api/src/app/equipe/equipe.validation.ts");
const class_validator_1 = __webpack_require__("class-validator");
const class_transformer_1 = __webpack_require__("class-transformer");
const common_2 = __webpack_require__("@nestjs/common");
class PostParamsValidation {
}
tslib_1.__decorate([
    class_validator_1.IsString(),
    class_validator_1.MinLength(1),
    class_validator_1.MaxLength(30),
    tslib_1.__metadata("design:type", String)
], PostParamsValidation.prototype, "teamName", void 0);
exports.PostParamsValidation = PostParamsValidation;
class PaginationParamsValidation {
}
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    class_transformer_1.Type(() => Number),
    class_validator_1.IsInt(),
    class_validator_1.Min(1),
    class_validator_1.Max(100),
    tslib_1.__metadata("design:type", Number)
], PaginationParamsValidation.prototype, "size", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    class_transformer_1.Type(() => Number),
    class_validator_1.IsInt(),
    class_validator_1.Min(1),
    tslib_1.__metadata("design:type", Number)
], PaginationParamsValidation.prototype, "page", void 0);
exports.PaginationParamsValidation = PaginationParamsValidation;
let EquipeController = class EquipeController {
    constructor(equipeService) {
        this.equipeService = equipeService;
    }
    create(dto) {
        return this.equipeService.create(dto);
    }
    findAll(paginationParams) {
        return this.equipeService.findAll(paginationParams);
    }
    findOne(id) {
        return this.equipeService.findOne(id);
    }
    update(id, dto) {
        return this.equipeService.update(Object.assign(Object.assign({}, dto), { id }));
    }
    reset(id, dto) {
        return this.equipeService.reset(Object.assign(Object.assign({}, dto), { id }));
    }
    remove(id) {
        return this.equipeService.remove(id);
    }
};
tslib_1.__decorate([
    common_1.Post(),
    swagger_1.ApiBody({ type: equipe_documentation_1.ApiEquipeCreateDto }),
    swagger_1.ApiCreatedResponse({ type: equipe_documentation_1.ApiEquipeDto }),
    swagger_1.ApiBadRequestResponse(),
    common_2.UseInterceptors(common_2.CacheInterceptor),
    tslib_1.__param(0, common_1.Body(new common_1.ValidationPipe({
        transform: true,
        expectedType: PostParamsValidation,
    }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof equipe_validation_1.EquipeCreateValidationDto !== "undefined" && equipe_validation_1.EquipeCreateValidationDto) === "function" ? _a : Object]),
    tslib_1.__metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], EquipeController.prototype, "create", null);
tslib_1.__decorate([
    swagger_1.ApiQuery({ name: 'page', type: 'integer', example: 1 }),
    swagger_1.ApiQuery({ name: 'size', type: 'integer', example: 10 }),
    common_2.UseInterceptors(common_2.CacheInterceptor),
    common_1.Get(),
    swagger_1.ApiOkResponse({ type: [equipe_documentation_1.ApiEquipeDto] }),
    tslib_1.__param(0, common_1.Query(new common_1.ValidationPipe({
        transform: true,
        expectedType: PaginationParamsValidation,
    }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], EquipeController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    swagger_1.ApiParam({ name: 'id', example: equipe_documentation_1.equipeExample.id }),
    swagger_1.ApiOkResponse({ type: equipe_documentation_1.ApiEquipeDto }),
    swagger_1.ApiNotFoundResponse(),
    swagger_1.ApiBadRequestResponse(),
    common_2.UseInterceptors(common_2.CacheInterceptor),
    tslib_1.__param(0, common_1.Param('id', id_1.IsObjectIdPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], EquipeController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Patch(':id'),
    swagger_1.ApiParam({ name: 'id', example: equipe_documentation_1.equipeExample.id }),
    swagger_1.ApiBody({ type: equipe_documentation_1.ApiEquipeUpdateDto }),
    swagger_1.ApiOkResponse({ type: equipe_documentation_1.ApiEquipeDto }),
    swagger_1.ApiNotFoundResponse(),
    swagger_1.ApiBadRequestResponse(),
    common_2.UseInterceptors(common_2.CacheInterceptor),
    tslib_1.__param(0, common_1.Param('id', id_1.IsObjectIdPipe)),
    tslib_1.__param(1, common_1.Body(new common_1.ValidationPipe({
        transform: true,
        expectedType: PostParamsValidation,
    }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_e = typeof equipe_validation_1.EquipeUpdateValidationDto !== "undefined" && equipe_validation_1.EquipeUpdateValidationDto) === "function" ? _e : Object]),
    tslib_1.__metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], EquipeController.prototype, "update", null);
tslib_1.__decorate([
    common_1.Put(':id'),
    swagger_1.ApiParam({ name: 'id', example: equipe_documentation_1.equipeExample.id }),
    swagger_1.ApiBody({ type: equipe_documentation_1.ApiEquipeResetDto }),
    swagger_1.ApiOkResponse({ type: equipe_documentation_1.ApiEquipeDto }),
    swagger_1.ApiNotFoundResponse(),
    swagger_1.ApiBadRequestResponse(),
    common_2.UseInterceptors(common_2.CacheInterceptor),
    tslib_1.__param(0, common_1.Param('id', id_1.IsObjectIdPipe)),
    tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_g = typeof equipe_validation_1.EquipeResetValidationDto !== "undefined" && equipe_validation_1.EquipeResetValidationDto) === "function" ? _g : Object]),
    tslib_1.__metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], EquipeController.prototype, "reset", null);
tslib_1.__decorate([
    common_1.Delete(':id'),
    common_1.HttpCode(common_1.HttpStatus.NO_CONTENT),
    swagger_1.ApiParam({ name: 'id', example: equipe_documentation_1.equipeExample.id }),
    swagger_1.ApiNoContentResponse(),
    swagger_1.ApiNotFoundResponse(),
    swagger_1.ApiBadRequestResponse(),
    common_2.UseInterceptors(common_2.CacheInterceptor),
    tslib_1.__param(0, common_1.Param('id', id_1.IsObjectIdPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], EquipeController.prototype, "remove", null);
EquipeController = tslib_1.__decorate([
    swagger_1.ApiTags(equipe_1.resourceEquipePath),
    common_1.Controller(equipe_1.resourceEquipePath),
    tslib_1.__metadata("design:paramtypes", [typeof (_k = typeof equipe_service_1.EquipeService !== "undefined" && equipe_service_1.EquipeService) === "function" ? _k : Object])
], EquipeController);
exports.EquipeController = EquipeController;


/***/ }),

/***/ "./apps/rest-api/src/app/equipe/equipe.documentation.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiEquipeResetDto = exports.ApiEquipeUpdateDto = exports.ApiEquipeCreateDto = exports.ApiEquipeDto = exports.equipeExample = void 0;
const tslib_1 = __webpack_require__("tslib");
const swagger_1 = __webpack_require__("@nestjs/swagger");
exports.equipeExample = {
    id: '6214c0f2857cfb3569c19166',
    teamName: `Toulouse`,
};
class ApiEquipeDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty({ example: exports.equipeExample.id }),
    tslib_1.__metadata("design:type", String)
], ApiEquipeDto.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({ example: exports.equipeExample.teamName }),
    tslib_1.__metadata("design:type", String)
], ApiEquipeDto.prototype, "teamName", void 0);
exports.ApiEquipeDto = ApiEquipeDto;
class ApiEquipeCreateDto extends swagger_1.OmitType(ApiEquipeDto, ['id']) {
}
exports.ApiEquipeCreateDto = ApiEquipeCreateDto;
class ApiEquipeUpdateDto extends swagger_1.IntersectionType(swagger_1.PickType(ApiEquipeDto, ['id']), swagger_1.PartialType(ApiEquipeCreateDto)) {
}
exports.ApiEquipeUpdateDto = ApiEquipeUpdateDto;
class ApiEquipeResetDto extends ApiEquipeUpdateDto {
}
exports.ApiEquipeResetDto = ApiEquipeResetDto;


/***/ }),

/***/ "./apps/rest-api/src/app/equipe/equipe.entity.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EquipeSchema = exports.EquipeEntity = void 0;
const tslib_1 = __webpack_require__("tslib");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
let EquipeEntity = class EquipeEntity {
};
tslib_1.__decorate([
    mongoose_1.Prop({ required: true }),
    tslib_1.__metadata("design:type", String)
], EquipeEntity.prototype, "teamName", void 0);
EquipeEntity = tslib_1.__decorate([
    mongoose_1.Schema({ collection: 'equipes' })
], EquipeEntity);
exports.EquipeEntity = EquipeEntity;
exports.EquipeSchema = mongoose_1.SchemaFactory.createForClass(EquipeEntity);


/***/ }),

/***/ "./apps/rest-api/src/app/equipe/equipe.mapper.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.equipeResetDtoToEntity = exports.equipeUpdateDtoToEntity = exports.equipeCreateDtoToEntity = exports.equipeDocumentToDto = void 0;
const common_1 = __webpack_require__("@nestjs/common");
const logMapper = new common_1.Logger('LogMapper');
const equipeDocumentToDto = (document) => {
    logMapper.debug('equipeDocumentToDto is find');
    logMapper.log('equipeDocumentToDto is find');
    logMapper.warn('equipeDocumentToDto is find');
    logMapper.error('equipeDocumentToDto is find');
    return {
        id: document.id,
        teamName: document.teamName,
    };
};
exports.equipeDocumentToDto = equipeDocumentToDto;
const equipeCreateDtoToEntity = (dto) => {
    logMapper.debug('equipeCreateDtoToEntity is find');
    logMapper.log('equipeCreateDtoToEntity is find');
    logMapper.warn('equipeCreateDtoToEntity is find');
    logMapper.error('equipeCreateDtoToEntity is find');
    return {
        teamName: dto.teamName,
    };
};
exports.equipeCreateDtoToEntity = equipeCreateDtoToEntity;
const equipeUpdateDtoToEntity = (dto) => {
    logMapper.debug('equipeUpdateDtoToEntity is find');
    logMapper.log('equipeUpdateDtoToEntity is find');
    logMapper.warn('equipeUpdateDtoToEntity is find');
    logMapper.error('equipeUpdateDtoToEntity is find');
    return {
        id: dto.id,
        teamName: dto.teamName,
    };
};
exports.equipeUpdateDtoToEntity = equipeUpdateDtoToEntity;
const equipeResetDtoToEntity = (dto) => {
    var _a;
    logMapper.debug('equipeResetDtoToEntity is find');
    logMapper.log('equipeResetDtoToEntity is find');
    logMapper.warn('equipeResetDtoToEntity is find');
    logMapper.error('equipeResetDtoToEntity is find');
    return {
        id: dto.id,
        teamName: (_a = dto.teamName) !== null && _a !== void 0 ? _a : null,
    };
};
exports.equipeResetDtoToEntity = equipeResetDtoToEntity;


/***/ }),

/***/ "./apps/rest-api/src/app/equipe/equipe.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EquipeModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const equipe_entity_1 = __webpack_require__("./apps/rest-api/src/app/equipe/equipe.entity.ts");
const equipe_service_1 = __webpack_require__("./apps/rest-api/src/app/equipe/equipe.service.ts");
const equipe_controller_1 = __webpack_require__("./apps/rest-api/src/app/equipe/equipe.controller.ts");
const common_2 = __webpack_require__("@nestjs/common");
let EquipeModule = class EquipeModule {
};
EquipeModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            common_2.CacheModule.register({
                ttl: 60,
                max: 10
            }),
            mongoose_1.MongooseModule.forFeature([
                {
                    name: equipe_entity_1.EquipeEntity.name,
                    schema: equipe_entity_1.EquipeSchema,
                },
            ]),
        ],
        controllers: [equipe_controller_1.EquipeController],
        providers: [equipe_service_1.EquipeService],
    })
], EquipeModule);
exports.EquipeModule = EquipeModule;


/***/ }),

/***/ "./apps/rest-api/src/app/equipe/equipe.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EquipeService = void 0;
const tslib_1 = __webpack_require__("tslib");
const error_1 = __webpack_require__("./libs/api/repository/error/src/index.ts");
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const mongoose_2 = __webpack_require__("mongoose");
const equipe_entity_1 = __webpack_require__("./apps/rest-api/src/app/equipe/equipe.entity.ts");
const equipe_mapper_1 = __webpack_require__("./apps/rest-api/src/app/equipe/equipe.mapper.ts");
let EquipeService = class EquipeService {
    constructor(model) {
        this.model = model;
    }
    create(dto) {
        const entity = equipe_mapper_1.equipeCreateDtoToEntity(dto);
        return this.model.create(entity).then(equipe_mapper_1.equipeDocumentToDto);
    }
    findAll(paginationParams) {
        return this.model
            .find()
            .skip((paginationParams.page - 1) * paginationParams.size)
            .limit(paginationParams.size)
            .exec()
            .then((entities) => entities.map(equipe_mapper_1.equipeDocumentToDto));
    }
    findOne(id) {
        return this.model
            .findById(id)
            .orFail()
            .exec()
            .then(equipe_mapper_1.equipeDocumentToDto)
            .catch(error_1.handleDocumentNotFound);
    }
    update(dto) {
        const entity = equipe_mapper_1.equipeUpdateDtoToEntity(dto);
        return this.model
            .findByIdAndUpdate(entity.id, entity, { new: true })
            .orFail()
            .exec()
            .then(equipe_mapper_1.equipeDocumentToDto)
            .catch(error_1.handleDocumentNotFound);
    }
    reset(dto) {
        const entity = equipe_mapper_1.equipeResetDtoToEntity(dto);
        return this.model
            .findByIdAndUpdate(entity.id, entity, { new: true })
            .orFail()
            .exec()
            .then(equipe_mapper_1.equipeDocumentToDto)
            .catch(error_1.handleDocumentNotFound);
    }
    remove(id) {
        return this.model
            .deleteOne({ _id: id })
            .orFail()
            .exec()
            .then(() => null)
            .catch(error_1.handleDocumentNotFound);
    }
};
EquipeService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, mongoose_1.InjectModel(equipe_entity_1.EquipeEntity.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], EquipeService);
exports.EquipeService = EquipeService;


/***/ }),

/***/ "./apps/rest-api/src/app/equipe/equipe.validation.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EquipeResetValidationDto = exports.EquipeUpdateValidationDto = exports.EquipeCreateValidationDto = exports.EquipeValidationDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const id_1 = __webpack_require__("./libs/api/validation/id/src/index.ts");
const mapped_types_1 = __webpack_require__("@nestjs/mapped-types");
const class_validator_1 = __webpack_require__("class-validator");
class EquipeValidationDto {
}
tslib_1.__decorate([
    id_1.IsObjectId(),
    tslib_1.__metadata("design:type", String)
], EquipeValidationDto.prototype, "id", void 0);
tslib_1.__decorate([
    class_validator_1.IsString(),
    tslib_1.__metadata("design:type", String)
], EquipeValidationDto.prototype, "teamName", void 0);
exports.EquipeValidationDto = EquipeValidationDto;
class EquipeCreateValidationDto extends mapped_types_1.OmitType(EquipeValidationDto, ['id']) {
}
exports.EquipeCreateValidationDto = EquipeCreateValidationDto;
class EquipeUpdateValidationDto extends mapped_types_1.IntersectionType(mapped_types_1.PickType(EquipeValidationDto, ['id']), mapped_types_1.PartialType(EquipeCreateValidationDto)) {
}
exports.EquipeUpdateValidationDto = EquipeUpdateValidationDto;
class EquipeResetValidationDto extends EquipeUpdateValidationDto {
}
exports.EquipeResetValidationDto = EquipeResetValidationDto;


/***/ }),

/***/ "./apps/rest-api/src/app/match/match.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MatchController = exports.FilterParamsValidation = exports.PostParamsValidation = exports.PaginationParamsValidation = void 0;
const tslib_1 = __webpack_require__("tslib");
const id_1 = __webpack_require__("./libs/api/validation/id/src/index.ts");
const match_1 = __webpack_require__("./libs/common/resource/match/src/index.ts");
const common_1 = __webpack_require__("@nestjs/common");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const match_documentation_1 = __webpack_require__("./apps/rest-api/src/app/match/match.documentation.ts");
const match_service_1 = __webpack_require__("./apps/rest-api/src/app/match/match.service.ts");
const match_validation_1 = __webpack_require__("./apps/rest-api/src/app/match/match.validation.ts");
const class_validator_1 = __webpack_require__("class-validator");
const class_transformer_1 = __webpack_require__("class-transformer");
const common_2 = __webpack_require__("@nestjs/common");
class PaginationParamsValidation {
}
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    class_transformer_1.Type(() => Number),
    class_validator_1.IsInt(),
    class_validator_1.Min(1),
    class_validator_1.Max(100),
    tslib_1.__metadata("design:type", Number)
], PaginationParamsValidation.prototype, "size", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    class_transformer_1.Type(() => Number),
    class_validator_1.IsInt(),
    class_validator_1.Min(1),
    tslib_1.__metadata("design:type", Number)
], PaginationParamsValidation.prototype, "page", void 0);
exports.PaginationParamsValidation = PaginationParamsValidation;
class PostParamsValidation {
}
tslib_1.__decorate([
    class_validator_1.IsString(),
    class_validator_1.MinLength(1),
    class_validator_1.MaxLength(50),
    tslib_1.__metadata("design:type", String)
], PostParamsValidation.prototype, "date", void 0);
tslib_1.__decorate([
    class_validator_1.IsString(),
    class_validator_1.MinLength(1),
    class_validator_1.MaxLength(30),
    tslib_1.__metadata("design:type", String)
], PostParamsValidation.prototype, "homeTeamName", void 0);
tslib_1.__decorate([
    class_validator_1.IsString(),
    class_validator_1.MinLength(1),
    class_validator_1.MaxLength(30),
    tslib_1.__metadata("design:type", String)
], PostParamsValidation.prototype, "awayTeamName", void 0);
tslib_1.__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsInt(),
    class_validator_1.Min(0),
    class_validator_1.Max(100),
    tslib_1.__metadata("design:type", Number)
], PostParamsValidation.prototype, "homeTeamScore", void 0);
tslib_1.__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsInt(),
    class_validator_1.Min(0),
    class_validator_1.Max(100),
    tslib_1.__metadata("design:type", Number)
], PostParamsValidation.prototype, "awayTeamScore", void 0);
exports.PostParamsValidation = PostParamsValidation;
class FilterParamsValidation {
}
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    tslib_1.__metadata("design:type", String)
], FilterParamsValidation.prototype, "team", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    tslib_1.__metadata("design:type", String)
], FilterParamsValidation.prototype, "date", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    tslib_1.__metadata("design:type", String)
], FilterParamsValidation.prototype, "homeTeamName", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    tslib_1.__metadata("design:type", String)
], FilterParamsValidation.prototype, "awayTeamName", void 0);
exports.FilterParamsValidation = FilterParamsValidation;
let MatchController = class MatchController {
    constructor(matchService) {
        this.matchService = matchService;
    }
    create(dto) {
        return this.matchService.create(dto);
    }
    findAll(paginationParams, filterParams) {
        return this.matchService.findAll(paginationParams, filterParams);
    }
    findOne(id) {
        return this.matchService.findOne(id);
    }
    update(id, dto) {
        return this.matchService.update(Object.assign(Object.assign({}, dto), { id }));
    }
    reset(id, dto) {
        return this.matchService.reset(Object.assign(Object.assign({}, dto), { id }));
    }
    remove(id) {
        return this.matchService.remove(id);
    }
};
tslib_1.__decorate([
    common_1.Post(),
    swagger_1.ApiBody({ type: match_documentation_1.ApiMatchCreateDto }),
    swagger_1.ApiCreatedResponse({ type: match_documentation_1.ApiMatchDto }),
    swagger_1.ApiBadRequestResponse(),
    common_2.UseInterceptors(common_2.CacheInterceptor),
    tslib_1.__param(0, common_1.Body(new common_1.ValidationPipe({
        transform: true,
        expectedType: PostParamsValidation,
    }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof match_validation_1.MatchCreateValidationDto !== "undefined" && match_validation_1.MatchCreateValidationDto) === "function" ? _a : Object]),
    tslib_1.__metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], MatchController.prototype, "create", null);
tslib_1.__decorate([
    common_1.Get(),
    swagger_1.ApiQuery({ name: 'page', type: 'integer', example: 1 }),
    swagger_1.ApiQuery({ name: 'size', type: 'integer', example: 10 }),
    swagger_1.ApiOkResponse({ type: [match_documentation_1.ApiMatchDto] }),
    common_2.UseInterceptors(common_2.CacheInterceptor),
    tslib_1.__param(0, common_1.Query(new common_1.ValidationPipe({
        transform: true,
        expectedType: PaginationParamsValidation,
    }))),
    tslib_1.__param(1, common_1.Query(new common_1.ValidationPipe({
        transform: true,
        expectedType: PaginationParamsValidation,
    }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], MatchController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    swagger_1.ApiParam({ name: 'id', example: match_documentation_1.matchExample.id }),
    swagger_1.ApiOkResponse({ type: match_documentation_1.ApiMatchDto }),
    swagger_1.ApiNotFoundResponse(),
    swagger_1.ApiBadRequestResponse(),
    common_2.UseInterceptors(common_2.CacheInterceptor),
    tslib_1.__param(0, common_1.Param('id', id_1.IsObjectIdPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], MatchController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Patch(':id'),
    swagger_1.ApiParam({ name: 'id', example: match_documentation_1.matchExample.id }),
    swagger_1.ApiBody({ type: match_documentation_1.ApiMatchUpdateDto }),
    swagger_1.ApiOkResponse({ type: match_documentation_1.ApiMatchDto }),
    swagger_1.ApiNotFoundResponse(),
    swagger_1.ApiBadRequestResponse(),
    common_2.UseInterceptors(common_2.CacheInterceptor),
    tslib_1.__param(0, common_1.Param('id', id_1.IsObjectIdPipe)),
    tslib_1.__param(1, common_1.Body(new common_1.ValidationPipe({
        transform: true,
        expectedType: PostParamsValidation,
    }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_e = typeof match_validation_1.MatchUpdateValidationDto !== "undefined" && match_validation_1.MatchUpdateValidationDto) === "function" ? _e : Object]),
    tslib_1.__metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], MatchController.prototype, "update", null);
tslib_1.__decorate([
    common_1.Put(':id'),
    swagger_1.ApiParam({ name: 'id', example: match_documentation_1.matchExample.id }),
    swagger_1.ApiBody({ type: match_documentation_1.ApiMatchResetDto }),
    swagger_1.ApiOkResponse({ type: match_documentation_1.ApiMatchDto }),
    swagger_1.ApiNotFoundResponse(),
    swagger_1.ApiBadRequestResponse(),
    common_2.UseInterceptors(common_2.CacheInterceptor),
    tslib_1.__param(0, common_1.Param('id', id_1.IsObjectIdPipe)),
    tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_g = typeof match_validation_1.MatchResetValidationDto !== "undefined" && match_validation_1.MatchResetValidationDto) === "function" ? _g : Object]),
    tslib_1.__metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], MatchController.prototype, "reset", null);
tslib_1.__decorate([
    common_1.Delete(':id'),
    common_1.HttpCode(common_1.HttpStatus.NO_CONTENT),
    swagger_1.ApiParam({ name: 'id', example: match_documentation_1.matchExample.id }),
    swagger_1.ApiNoContentResponse(),
    swagger_1.ApiNotFoundResponse(),
    swagger_1.ApiBadRequestResponse(),
    common_2.UseInterceptors(common_2.CacheInterceptor),
    tslib_1.__param(0, common_1.Param('id', id_1.IsObjectIdPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], MatchController.prototype, "remove", null);
MatchController = tslib_1.__decorate([
    swagger_1.ApiTags(match_1.resourceMatchPath),
    common_1.Controller(match_1.resourceMatchPath),
    tslib_1.__metadata("design:paramtypes", [typeof (_k = typeof match_service_1.MatchService !== "undefined" && match_service_1.MatchService) === "function" ? _k : Object])
], MatchController);
exports.MatchController = MatchController;


/***/ }),

/***/ "./apps/rest-api/src/app/match/match.documentation.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiMatchResetDto = exports.ApiMatchUpdateDto = exports.ApiMatchCreateDto = exports.ApiMatchDto = exports.matchExample = void 0;
const tslib_1 = __webpack_require__("tslib");
const swagger_1 = __webpack_require__("@nestjs/swagger");
exports.matchExample = {
    id: '6214c0f2857cfb3569c19166',
    date: '2022-03-08T21:00:00.000+01:00',
    homeTeamName: 'Liverpool',
    awayTeamName: 'Inter Milan',
    homeTeamScore: 0,
    awayTeamScore: 1,
};
class ApiMatchDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty({ example: exports.matchExample.id }),
    tslib_1.__metadata("design:type", String)
], ApiMatchDto.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({ example: exports.matchExample.date, format: 'date-time' }),
    tslib_1.__metadata("design:type", String)
], ApiMatchDto.prototype, "date", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({ example: exports.matchExample.homeTeamName }),
    tslib_1.__metadata("design:type", String)
], ApiMatchDto.prototype, "homeTeamName", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({ example: exports.matchExample.awayTeamName }),
    tslib_1.__metadata("design:type", String)
], ApiMatchDto.prototype, "awayTeamName", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        example: exports.matchExample.homeTeamScore,
        type: 'integer',
        minimum: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], ApiMatchDto.prototype, "homeTeamScore", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        example: exports.matchExample.awayTeamScore,
        type: 'integer',
        minimum: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], ApiMatchDto.prototype, "awayTeamScore", void 0);
exports.ApiMatchDto = ApiMatchDto;
class ApiMatchCreateDto extends swagger_1.OmitType(ApiMatchDto, ['id']) {
}
exports.ApiMatchCreateDto = ApiMatchCreateDto;
class ApiMatchUpdateDto extends swagger_1.IntersectionType(swagger_1.PickType(ApiMatchDto, ['id']), swagger_1.PartialType(ApiMatchCreateDto)) {
}
exports.ApiMatchUpdateDto = ApiMatchUpdateDto;
class ApiMatchResetDto extends ApiMatchUpdateDto {
}
exports.ApiMatchResetDto = ApiMatchResetDto;


/***/ }),

/***/ "./apps/rest-api/src/app/match/match.entity.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MatchSchema = exports.MatchEntity = void 0;
const tslib_1 = __webpack_require__("tslib");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
let MatchEntity = class MatchEntity {
};
tslib_1.__decorate([
    mongoose_1.Prop({ required: true, type: Date }),
    tslib_1.__metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], MatchEntity.prototype, "date", void 0);
tslib_1.__decorate([
    mongoose_1.Prop(),
    tslib_1.__metadata("design:type", String)
], MatchEntity.prototype, "homeTeamName", void 0);
tslib_1.__decorate([
    mongoose_1.Prop(),
    tslib_1.__metadata("design:type", String)
], MatchEntity.prototype, "awayTeamName", void 0);
tslib_1.__decorate([
    mongoose_1.Prop(),
    tslib_1.__metadata("design:type", Number)
], MatchEntity.prototype, "homeTeamScore", void 0);
tslib_1.__decorate([
    mongoose_1.Prop(),
    tslib_1.__metadata("design:type", Number)
], MatchEntity.prototype, "awayTeamScore", void 0);
MatchEntity = tslib_1.__decorate([
    mongoose_1.Schema({ collection: 'matchs' })
], MatchEntity);
exports.MatchEntity = MatchEntity;
exports.MatchSchema = mongoose_1.SchemaFactory.createForClass(MatchEntity);


/***/ }),

/***/ "./apps/rest-api/src/app/match/match.mapper.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.matchResetDtoToEntity = exports.matchUpdateDtoToEntity = exports.matchCreateDtoToEntity = exports.matchDocumentToDto = void 0;
const common_1 = __webpack_require__("@nestjs/common");
const logMapper = new common_1.Logger('LogMapper');
const matchDocumentToDto = (document) => {
    var _a;
    logMapper.debug('matchDocumentToDto is find');
    logMapper.log('matchDocumentToDto is find');
    logMapper.warn('matchDocumentToDto is find');
    logMapper.error('matchDocumentToDto is find');
    return {
        id: document.id,
        date: (_a = document.date) === null || _a === void 0 ? void 0 : _a.toISOString(),
        homeTeamName: document.homeTeamName,
        awayTeamName: document.awayTeamName,
        homeTeamScore: document.homeTeamScore,
        awayTeamScore: document.awayTeamScore,
    };
};
exports.matchDocumentToDto = matchDocumentToDto;
const matchCreateDtoToEntity = (dto) => {
    logMapper.debug('matchCreateDtoToEntity is find');
    logMapper.log('matchCreateDtoToEntity is find');
    logMapper.warn('matchCreateDtoToEntity is find');
    logMapper.error('matchCreateDtoToEntity is find');
    return {
        date: dto.date && new Date(dto.date),
        homeTeamName: dto.homeTeamName,
        awayTeamName: dto.awayTeamName,
        homeTeamScore: dto.homeTeamScore,
        awayTeamScore: dto.awayTeamScore,
    };
};
exports.matchCreateDtoToEntity = matchCreateDtoToEntity;
const matchUpdateDtoToEntity = (dto) => {
    logMapper.debug('matchUpdateDtoToEntity is find');
    logMapper.log('matchUpdateDtoToEntity is find');
    logMapper.warn('matchUpdateDtoToEntity is find');
    logMapper.error('matchUpdateDtoToEntity is find');
    return {
        id: dto.id,
        date: dto.date && new Date(dto.date),
        homeTeamName: dto.homeTeamName,
        awayTeamName: dto.awayTeamName,
        homeTeamScore: dto.homeTeamScore,
        awayTeamScore: dto.awayTeamScore,
    };
};
exports.matchUpdateDtoToEntity = matchUpdateDtoToEntity;
const matchResetDtoToEntity = (dto) => {
    var _a, _b, _c, _d;
    logMapper.debug('matchResetDtoToEntity is find');
    logMapper.log('matchResetDtoToEntity is find');
    logMapper.warn('matchResetDtoToEntity is find');
    logMapper.error('matchResetDtoToEntity is find');
    return {
        id: dto.id,
        date: dto.date ? new Date(dto.date) : null,
        homeTeamName: (_a = dto.homeTeamName) !== null && _a !== void 0 ? _a : null,
        awayTeamName: (_b = dto.awayTeamName) !== null && _b !== void 0 ? _b : null,
        homeTeamScore: (_c = dto.homeTeamScore) !== null && _c !== void 0 ? _c : null,
        awayTeamScore: (_d = dto.awayTeamScore) !== null && _d !== void 0 ? _d : null,
    };
};
exports.matchResetDtoToEntity = matchResetDtoToEntity;


/***/ }),

/***/ "./apps/rest-api/src/app/match/match.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MatchModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const match_entity_1 = __webpack_require__("./apps/rest-api/src/app/match/match.entity.ts");
const match_service_1 = __webpack_require__("./apps/rest-api/src/app/match/match.service.ts");
const match_controller_1 = __webpack_require__("./apps/rest-api/src/app/match/match.controller.ts");
const common_2 = __webpack_require__("@nestjs/common");
let MatchModule = class MatchModule {
};
MatchModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            common_2.CacheModule.register({
                ttl: 60,
                max: 10
            }),
            mongoose_1.MongooseModule.forFeature([
                {
                    name: match_entity_1.MatchEntity.name,
                    schema: match_entity_1.MatchSchema,
                },
            ]),
        ],
        controllers: [match_controller_1.MatchController],
        providers: [match_service_1.MatchService],
    })
], MatchModule);
exports.MatchModule = MatchModule;


/***/ }),

/***/ "./apps/rest-api/src/app/match/match.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MatchService = void 0;
const tslib_1 = __webpack_require__("tslib");
const error_1 = __webpack_require__("./libs/api/repository/error/src/index.ts");
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const mongoose_2 = __webpack_require__("mongoose");
const match_entity_1 = __webpack_require__("./apps/rest-api/src/app/match/match.entity.ts");
const match_mapper_1 = __webpack_require__("./apps/rest-api/src/app/match/match.mapper.ts");
let MatchService = class MatchService {
    constructor(model) {
        this.model = model;
    }
    create(dto) {
        const entity = match_mapper_1.matchCreateDtoToEntity(dto);
        return this.model.create(entity).then(match_mapper_1.matchDocumentToDto);
    }
    findAll(paginationParams, filterParams) {
        return this.model
            .find(Object.assign(Object.assign(Object.assign(Object.assign({}, (filterParams.homeTeamName
            ? { homeTeamName: filterParams.homeTeamName }
            : {})), (filterParams.awayTeamName
            ? { awayTeamName: filterParams.awayTeamName }
            : {})), (filterParams.team
            ? {
                $or: [
                    { awayTeamName: filterParams.team },
                    { homeTeamName: filterParams.team },
                ],
            }
            : {})), (filterParams.date
            ? {
                date: {
                    $gte: new Date(filterParams.date),
                    $lt: new Date(filterParams.date).setDate(new Date(filterParams.date).getDate() + 1),
                },
            }
            : {})))
            .skip((paginationParams.page - 1) * paginationParams.size)
            .limit(paginationParams.size)
            .exec()
            .then((entities) => entities.map(match_mapper_1.matchDocumentToDto));
    }
    findOne(id) {
        return this.model
            .findById(id)
            .orFail()
            .exec()
            .then(match_mapper_1.matchDocumentToDto)
            .catch(error_1.handleDocumentNotFound);
    }
    update(dto) {
        const entity = match_mapper_1.matchUpdateDtoToEntity(dto);
        return this.model
            .findByIdAndUpdate(entity.id, entity, { new: true })
            .orFail()
            .exec()
            .then(match_mapper_1.matchDocumentToDto)
            .catch(error_1.handleDocumentNotFound);
    }
    reset(dto) {
        const entity = match_mapper_1.matchResetDtoToEntity(dto);
        return this.model
            .findByIdAndUpdate(entity.id, entity, { new: true })
            .orFail()
            .exec()
            .then(match_mapper_1.matchDocumentToDto)
            .catch(error_1.handleDocumentNotFound);
    }
    remove(id) {
        return this.model
            .deleteOne({ _id: id })
            .orFail()
            .exec()
            .then(() => null)
            .catch(error_1.handleDocumentNotFound);
    }
};
MatchService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, mongoose_1.InjectModel(match_entity_1.MatchEntity.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], MatchService);
exports.MatchService = MatchService;


/***/ }),

/***/ "./apps/rest-api/src/app/match/match.validation.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MatchResetValidationDto = exports.MatchUpdateValidationDto = exports.MatchCreateValidationDto = exports.MatchValidationDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const id_1 = __webpack_require__("./libs/api/validation/id/src/index.ts");
const mapped_types_1 = __webpack_require__("@nestjs/mapped-types");
const class_validator_1 = __webpack_require__("class-validator");
class MatchValidationDto {
}
tslib_1.__decorate([
    id_1.IsObjectId(),
    tslib_1.__metadata("design:type", String)
], MatchValidationDto.prototype, "id", void 0);
tslib_1.__decorate([
    class_validator_1.IsDateString(),
    tslib_1.__metadata("design:type", String)
], MatchValidationDto.prototype, "date", void 0);
tslib_1.__decorate([
    class_validator_1.IsString(),
    tslib_1.__metadata("design:type", String)
], MatchValidationDto.prototype, "homeTeamName", void 0);
tslib_1.__decorate([
    class_validator_1.IsString(),
    tslib_1.__metadata("design:type", String)
], MatchValidationDto.prototype, "awayTeamName", void 0);
tslib_1.__decorate([
    class_validator_1.IsInt(),
    class_validator_1.Min(0),
    tslib_1.__metadata("design:type", Number)
], MatchValidationDto.prototype, "homeTeamScore", void 0);
tslib_1.__decorate([
    class_validator_1.IsInt(),
    class_validator_1.Min(0),
    tslib_1.__metadata("design:type", Number)
], MatchValidationDto.prototype, "awayTeamScore", void 0);
exports.MatchValidationDto = MatchValidationDto;
class MatchCreateValidationDto extends mapped_types_1.OmitType(MatchValidationDto, ['id']) {
}
exports.MatchCreateValidationDto = MatchCreateValidationDto;
class MatchUpdateValidationDto extends mapped_types_1.IntersectionType(mapped_types_1.PickType(MatchValidationDto, ['id']), mapped_types_1.PartialType(MatchCreateValidationDto)) {
}
exports.MatchUpdateValidationDto = MatchUpdateValidationDto;
class MatchResetValidationDto extends MatchUpdateValidationDto {
}
exports.MatchResetValidationDto = MatchResetValidationDto;


/***/ }),

/***/ "./apps/rest-api/src/environments/environment.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.environment = void 0;
exports.environment = {
    filePath: '.env',
    production: false,
};


/***/ }),

/***/ "./libs/api/repository/error/src/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./libs/api/repository/error/src/lib/api-repository-error.ts"), exports);


/***/ }),

/***/ "./libs/api/repository/error/src/lib/api-repository-error.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handleDocumentNotFound = exports.apiRepositoryError = void 0;
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("mongoose");
function apiRepositoryError() {
    return 'api-repository-error';
}
exports.apiRepositoryError = apiRepositoryError;
const handleDocumentNotFound = (error) => {
    if (error instanceof mongoose_1.Error.DocumentNotFoundError) {
        throw new common_1.NotFoundException();
    }
    throw error;
};
exports.handleDocumentNotFound = handleDocumentNotFound;


/***/ }),

/***/ "./libs/api/validation/id/src/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./libs/api/validation/id/src/lib/api-validation-id.module.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./libs/api/validation/id/src/lib/is-object-id.pipe.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./libs/api/validation/id/src/lib/is-object-id.decorator.ts"), exports);


/***/ }),

/***/ "./libs/api/validation/id/src/lib/api-validation-id.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiValidationIdModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
let ApiValidationIdModule = class ApiValidationIdModule {
};
ApiValidationIdModule = tslib_1.__decorate([
    common_1.Module({
        controllers: [],
        providers: [],
        exports: [],
    })
], ApiValidationIdModule);
exports.ApiValidationIdModule = ApiValidationIdModule;


/***/ }),

/***/ "./libs/api/validation/id/src/lib/is-object-id.decorator.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IsObjectId = void 0;
const class_validator_1 = __webpack_require__("class-validator");
const is_object_id_util_1 = __webpack_require__("./libs/api/validation/id/src/lib/is-object-id.util.ts");
function IsObjectId(validationOptions) {
    return function (object, propertyName) {
        class_validator_1.registerDecorator({
            name: 'isObjectId',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: Object.assign({ message: (validationOptions === null || validationOptions === void 0 ? void 0 : validationOptions.message) || `${propertyName} must be an object id` }, validationOptions),
            validator: {
                validate(value) {
                    return typeof value === 'string' && is_object_id_util_1.isObjectId(value);
                },
            },
        });
    };
}
exports.IsObjectId = IsObjectId;


/***/ }),

/***/ "./libs/api/validation/id/src/lib/is-object-id.pipe.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IsObjectIdPipe = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const is_object_id_util_1 = __webpack_require__("./libs/api/validation/id/src/lib/is-object-id.util.ts");
const checkObjectId = (value) => {
    if (is_object_id_util_1.isObjectId(value)) {
        return value;
    }
    throw new common_1.BadRequestException();
};
let IsObjectIdPipe = class IsObjectIdPipe {
    transform(value, metadata) {
        const id = value;
        switch (metadata.type) {
            case 'param':
            case 'query':
                return checkObjectId(id);
            default:
                return value;
        }
    }
};
IsObjectIdPipe = tslib_1.__decorate([
    common_1.Injectable()
], IsObjectIdPipe);
exports.IsObjectIdPipe = IsObjectIdPipe;


/***/ }),

/***/ "./libs/api/validation/id/src/lib/is-object-id.util.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isObjectId = void 0;
const mongoose_1 = __webpack_require__("mongoose");
const isObjectId = (value) => mongoose_1.Types.ObjectId.isValid(value);
exports.isObjectId = isObjectId;


/***/ }),

/***/ "./libs/common/resource/core/src/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./libs/common/resource/core/src/lib/common-resource-core.ts"), exports);


/***/ }),

/***/ "./libs/common/resource/core/src/lib/common-resource-core.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.apiPathPrefix = exports.commonResourceCore = void 0;
function commonResourceCore() {
    return 'common-resource-core';
}
exports.commonResourceCore = commonResourceCore;
exports.apiPathPrefix = 'api';


/***/ }),

/***/ "./libs/common/resource/equipe/src/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./libs/common/resource/equipe/src/lib/common-resource-equipe.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./libs/common/resource/equipe/src/lib/equipe.dto.ts"), exports);


/***/ }),

/***/ "./libs/common/resource/equipe/src/lib/common-resource-equipe.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resourceEquipePath = exports.commonResourceEquipe = void 0;
function commonResourceEquipe() {
    return 'common-resource-equipe';
}
exports.commonResourceEquipe = commonResourceEquipe;
exports.resourceEquipePath = 'equipes';


/***/ }),

/***/ "./libs/common/resource/equipe/src/lib/equipe.dto.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./libs/common/resource/match/src/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./libs/common/resource/match/src/lib/common-resource-match.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./libs/common/resource/match/src/lib/match.dto.ts"), exports);


/***/ }),

/***/ "./libs/common/resource/match/src/lib/common-resource-match.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resourceMatchPath = exports.commonResourceMatch = void 0;
function commonResourceMatch() {
    return 'common-resource-match';
}
exports.commonResourceMatch = commonResourceMatch;
exports.resourceMatchPath = 'matchs';


/***/ }),

/***/ "./libs/common/resource/match/src/lib/match.dto.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "@nestjs/common":
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/mapped-types":
/***/ ((module) => {

module.exports = require("@nestjs/mapped-types");

/***/ }),

/***/ "@nestjs/mongoose":
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),

/***/ "@nestjs/swagger":
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),

/***/ "class-transformer":
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),

/***/ "class-validator":
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),

/***/ "compression":
/***/ ((module) => {

module.exports = require("compression");

/***/ }),

/***/ "express-winston":
/***/ ((module) => {

module.exports = require("express-winston");

/***/ }),

/***/ "helmet":
/***/ ((module) => {

module.exports = require("helmet");

/***/ }),

/***/ "mongoose":
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "nest-winston":
/***/ ((module) => {

module.exports = require("nest-winston");

/***/ }),

/***/ "tslib":
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),

/***/ "winston":
/***/ ((module) => {

module.exports = require("winston");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
const core_1 = __webpack_require__("./libs/common/resource/core/src/index.ts");
const common_1 = __webpack_require__("@nestjs/common");
const core_2 = __webpack_require__("@nestjs/core");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const app_module_1 = __webpack_require__("./apps/rest-api/src/app/app.module.ts");
const nest_winston_1 = __webpack_require__("nest-winston");
const expressWinston = __webpack_require__("express-winston");
const compression = __webpack_require__("compression");
const helmet_1 = __webpack_require__("helmet");
function bootstrap() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const app = yield core_2.NestFactory.create(app_module_1.AppModule);
        app.use(compression());
        app.use(helmet_1.default());
        const globalPrefix = core_1.apiPathPrefix;
        app.setGlobalPrefix(globalPrefix);
        const logger = app.get(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER);
        app.useLogger(logger);
        app.use(expressWinston.logger({
            winstonInstance: logger,
            msg: '{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}',
        }));
        const config = new swagger_1.DocumentBuilder()
            .setTitle('RenduTp')
            .setDescription('RenduTp Desc')
            .setVersion('1.0')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup(globalPrefix, app, document);
        const port = process.env.PORT || 3333;
        yield app.listen(port);
        common_1.Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
    });
}
bootstrap();

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=main.js.map