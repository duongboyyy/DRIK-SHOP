using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System;

namespace API.Data
{
    public partial class DBContextProcedures
    {
        private readonly DPContext _context;
        public DBContextProcedures(DPContext context)
        {
            _context = context;
        }

        public static string GetName<T>(Expression<Func<T>> memberExpression)
        {
            var expressionBody = (MemberExpression)memberExpression.Body;
            return expressionBody.Member.Name;


            //string testVariable = "value";
            //string nameOfTestVariable = GetName(() => testVariable);

            //string nameOfTestVariableObjectId = GetName(() => ObjectId);

            //var nameVariable = nameof(ObjectId);
        }

        public static SqlParameter SetParameter(string name, object value)
        {
            if (value == null)
                return new SqlParameter(name, DBNull.Value);
            return new SqlParameter(name, value);
        }

        //public async Task<ReportByCTVTotal[]> ReportByCTV_Total(string Key, int? IdGroup, DateTime? FromDate, DateTime? ToDate, int? offset, int? Limit, string SortField, bool? IsAsc)
        //{
        //    var parameterKey = new SqlParameter
        //    {
        //        ParameterName = "Key",
        //        Precision = 200,
        //        Size = 400,
        //        SqlDbType = System.Data.SqlDbType.NVarChar,
        //        Value = Key,
        //    };

        //    var parameterIdGroup = new SqlParameter
        //    {
        //        ParameterName = "IdGroup",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = IdGroup,
        //    };

        //    var parameterFromDate = new SqlParameter
        //    {
        //        ParameterName = "FromDate",
        //        Precision = 10,
        //        Size = 3,
        //        SqlDbType = System.Data.SqlDbType.Date,
        //        Value = FromDate,
        //    };

        //    var parameterToDate = new SqlParameter
        //    {
        //        ParameterName = "ToDate",
        //        Precision = 10,
        //        Size = 3,
        //        SqlDbType = System.Data.SqlDbType.Date,
        //        Value = ToDate,
        //    };

        //    var result = await _context.SqlQuery<ReportByCTVTotal>("EXEC [dbo].[ReportByCTV_Total] @Key,@IdGroup,@FromDate,@ToDate", parameterKey, parameterIdGroup, parameterFromDate, parameterToDate);

        //    return result;
        //}


        //public async Task<int> DeleteUser(string Phone)
        //{
        //    var parameterPhone = new SqlParameter
        //    {
        //        ParameterName = "Phone",
        //        Precision = 20,
        //        Size = 20,
        //        SqlDbType = System.Data.SqlDbType.VarChar,
        //        Value = Phone,
        //    };

        //    return await _context.Database.ExecuteSqlRawAsync("EXEC [dbo].[DeleteUser] @Phone  ", parameterPhone);
        //}

        //public async Task<int> JobTinhDiemDanhGia()
        //{
        //    return await _context.Database.ExecuteSqlRawAsync("EXEC [dbo].[JobTinhDiemDanhGia]");
        //}

        //public async Task<int> Point_CancelWithdraw(int? IdPoint, int? UserId, int? Deal, int? dealType, int? Status, OutputParameter<int?> retVal)
        //{
        //    var parameterIdPoint = new SqlParameter
        //    {
        //        ParameterName = "IdPoint",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = IdPoint,
        //    };

        //    var parameterUserId = new SqlParameter
        //    {
        //        ParameterName = "UserId",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = UserId,
        //    };

        //    var parameterDeal = new SqlParameter
        //    {
        //        ParameterName = "Deal",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = Deal,
        //    };

        //    var parameterdealType = new SqlParameter
        //    {
        //        ParameterName = "dealType",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = dealType,
        //    };

        //    var parameterStatus = new SqlParameter
        //    {
        //        ParameterName = "Status",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = Status,
        //    };

        //    var parameterretVal = new SqlParameter
        //    {
        //        ParameterName = "retVal",
        //        Precision = 10,
        //        Size = 4,
        //        Direction = System.Data.ParameterDirection.Output,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = retVal,
        //    };

        //    return await _context.Database.ExecuteSqlRawAsync("EXEC [dbo].[Point_CancelWithdraw] @IdPoint,@UserId,@Deal,@dealType,@Status, @retVal OUTPUT ", parameterIdPoint, parameterUserId, parameterDeal, parameterdealType, parameterStatus, parameterretVal);
        //    retVal.SetValueInternal(parameterretVal.Value);
        //}

        //public async Task<int> Point_Deposit(int? ObjectId, int? UserId, int? Deal, int? dealType, int? Status, int? CreatedUserId, OutputParameter<int?> retVal)
        //{
        //    var parameterObjectId = new SqlParameter
        //    {
        //        ParameterName = "ObjectId",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = ObjectId,
        //    };

        //    var parameterUserId = new SqlParameter
        //    {
        //        ParameterName = "UserId",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = UserId,
        //    };

        //    var parameterDeal = new SqlParameter
        //    {
        //        ParameterName = "Deal",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = Deal,
        //    };

        //    var parameterdealType = new SqlParameter
        //    {
        //        ParameterName = "dealType",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = dealType,
        //    };

        //    var parameterStatus = new SqlParameter
        //    {
        //        ParameterName = "Status",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = Status,
        //    };

        //    var parameterCreatedUserId = new SqlParameter
        //    {
        //        ParameterName = "CreatedUserId",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = CreatedUserId,
        //    };

        //    var parameterretVal = new SqlParameter
        //    {
        //        ParameterName = "retVal",
        //        Precision = 10,
        //        Size = 4,
        //        Direction = System.Data.ParameterDirection.Output,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = retVal,
        //    };

        //    return await _context.Database.ExecuteSqlRawAsync("EXEC [dbo].[Point_Deposit] @ObjectId,@UserId,@Deal,@dealType,@Status,@CreatedUserId, @retVal OUTPUT ", parameterObjectId, parameterUserId, parameterDeal, parameterdealType, parameterStatus, parameterCreatedUserId, parameterretVal);
        //    retVal.SetValueInternal(parameterretVal.Value);
        //}

        //public async Task<int> Point_Error(int? IdPoint, int? UserId, int? Deal, int? dealType, int? Status, int? CreatedUserId, string Note, OutputParameter<int?> retVal)
        //{
        //    var parameterIdPoint = new SqlParameter
        //    {
        //        ParameterName = "IdPoint",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = IdPoint,
        //    };

        //    var parameterUserId = new SqlParameter
        //    {
        //        ParameterName = "UserId",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = UserId,
        //    };

        //    var parameterDeal = new SqlParameter
        //    {
        //        ParameterName = "Deal",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = Deal,
        //    };

        //    var parameterdealType = new SqlParameter
        //    {
        //        ParameterName = "dealType",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = dealType,
        //    };

        //    var parameterStatus = new SqlParameter
        //    {
        //        ParameterName = "Status",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = Status,
        //    };

        //    var parameterCreatedUserId = new SqlParameter
        //    {
        //        ParameterName = "CreatedUserId",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = CreatedUserId,
        //    };

        //    var parameterNote = new SqlParameter
        //    {
        //        ParameterName = "Note",
        //        Precision = 200,
        //        Size = 400,
        //        SqlDbType = System.Data.SqlDbType.NVarChar,
        //        Value = Note,
        //    };

        //    var parameterretVal = new SqlParameter
        //    {
        //        ParameterName = "retVal",
        //        Precision = 10,
        //        Size = 4,
        //        Direction = System.Data.ParameterDirection.Output,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = retVal,
        //    };

        //    return await _context.Database.ExecuteSqlRawAsync("EXEC [dbo].[Point_Error] @IdPoint,@UserId,@Deal,@dealType,@Status,@CreatedUserId,@Note, @retVal OUTPUT ", parameterIdPoint, parameterUserId, parameterDeal, parameterdealType, parameterStatus, parameterCreatedUserId, parameterNote, parameterretVal);
        //    retVal.SetValueInternal(parameterretVal.Value);
        //}

        //public async Task<int> Point_TransferTax(int? ObjectId, int? UserId, int? IdDapFood, int? Deal, int? dealType, int? Status, OutputParameter<int?> retVal)
        //{
        //    var parameterObjectId = new SqlParameter
        //    {
        //        ParameterName = "ObjectId",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = ObjectId,
        //    };

        //    var parameterUserId = new SqlParameter
        //    {
        //        ParameterName = "UserId",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = UserId,
        //    };

        //    var parameterIdDapFood = new SqlParameter
        //    {
        //        ParameterName = "IdDapFood",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = IdDapFood,
        //    };

        //    var parameterDeal = new SqlParameter
        //    {
        //        ParameterName = "Deal",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = Deal,
        //    };

        //    var parameterdealType = new SqlParameter
        //    {
        //        ParameterName = "dealType",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = dealType,
        //    };

        //    var parameterStatus = new SqlParameter
        //    {
        //        ParameterName = "Status",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = Status,
        //    };

        //    var parameterretVal = new SqlParameter
        //    {
        //        ParameterName = "retVal",
        //        Precision = 10,
        //        Size = 4,
        //        Direction = System.Data.ParameterDirection.Output,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = retVal,
        //    };

        //    return await _context.Database.ExecuteSqlRawAsync("EXEC [dbo].[Point_TransferTax] @ObjectId,@UserId,@IdDapFood,@Deal,@dealType,@Status, @retVal OUTPUT ", parameterObjectId, parameterUserId, parameterIdDapFood, parameterDeal, parameterdealType, parameterStatus, parameterretVal);
        //    retVal.SetValueInternal(parameterretVal.Value);
        //}

        //public async Task<int> Point_Withdraw(int? UserId, int? Deal, int? dealType, int? Status, int? pointDealType, int? pointStatus, string bankCode, int? accountType, string code, int? fee, int? tax, OutputParameter<int?> retVal)
        //{
        //    var parameterUserId = new SqlParameter
        //    {
        //        ParameterName = "UserId",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = UserId,
        //    };

        //    var parameterDeal = new SqlParameter
        //    {
        //        ParameterName = "Deal",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = Deal,
        //    };

        //    var parameterdealType = new SqlParameter
        //    {
        //        ParameterName = "dealType",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = dealType,
        //    };

        //    var parameterStatus = new SqlParameter
        //    {
        //        ParameterName = "Status",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = Status,
        //    };

        //    var parameterpointDealType = new SqlParameter
        //    {
        //        ParameterName = "pointDealType",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = pointDealType,
        //    };

        //    var parameterpointStatus = new SqlParameter
        //    {
        //        ParameterName = "pointStatus",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = pointStatus,
        //    };

        //    var parameterbankCode = new SqlParameter
        //    {
        //        ParameterName = "bankCode",
        //        Precision = 50,
        //        Size = 100,
        //        SqlDbType = System.Data.SqlDbType.NVarChar,
        //        Value = bankCode,
        //    };

        //    var parameteraccountType = new SqlParameter
        //    {
        //        ParameterName = "accountType",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = accountType,
        //    };

        //    var parametercode = new SqlParameter
        //    {
        //        ParameterName = "code",
        //        Precision = 50,
        //        Size = 100,
        //        SqlDbType = System.Data.SqlDbType.NVarChar,
        //        Value = code,
        //    };

        //    var parameterfee = new SqlParameter
        //    {
        //        ParameterName = "fee",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = fee,
        //    };

        //    var parametertax = new SqlParameter
        //    {
        //        ParameterName = "tax",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = tax,
        //    };

        //    var parameterretVal = new SqlParameter
        //    {
        //        ParameterName = "retVal",
        //        Precision = 10,
        //        Size = 4,
        //        Direction = System.Data.ParameterDirection.Output,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = retVal,
        //    };

        //    return await _context.Database.ExecuteSqlRawAsync("EXEC [dbo].[Point_Withdraw] @UserId,@Deal,@dealType,@Status,@pointDealType,@pointStatus,@bankCode,@accountType,@code,@fee,@tax, @retVal OUTPUT ", parameterUserId, parameterDeal, parameterdealType, parameterStatus, parameterpointDealType, parameterpointStatus, parameterbankCode, parameteraccountType, parametercode, parameterfee, parametertax, parameterretVal);
        //    retVal.SetValueInternal(parameterretVal.Value);
        //}

        //public async Task<ReportByClientResult[]> ReportByClient(string Key, DateTime? FromDate, DateTime? ToDate, int? offset, int? Limit, string SortField, bool? IsAsc)
        //{
        //    var parameterKey = new SqlParameter
        //    {
        //        ParameterName = "Key",
        //        Precision = 200,
        //        Size = 400,
        //        SqlDbType = System.Data.SqlDbType.NVarChar,
        //        Value = Key,
        //    };

        //    var parameterFromDate = new SqlParameter
        //    {
        //        ParameterName = "FromDate",
        //        Precision = 10,
        //        Size = 3,
        //        SqlDbType = System.Data.SqlDbType.Date,
        //        Value = FromDate,
        //    };

        //    var parameterToDate = new SqlParameter
        //    {
        //        ParameterName = "ToDate",
        //        Precision = 10,
        //        Size = 3,
        //        SqlDbType = System.Data.SqlDbType.Date,
        //        Value = ToDate,
        //    };

        //    var parameteroffset = new SqlParameter
        //    {
        //        ParameterName = "Offset",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = offset,
        //    };

        //    var parameterLimit = new SqlParameter
        //    {
        //        ParameterName = "Limit",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = Limit,
        //    };

        //    var parameterSortField = new SqlParameter
        //    {
        //        ParameterName = "SortField",
        //        Precision = 100,
        //        Size = 100,
        //        SqlDbType = System.Data.SqlDbType.VarChar,
        //        Value = SortField,
        //    };

        //    var parameterIsAsc = new SqlParameter
        //    {
        //        ParameterName = "IsAsc",
        //        Precision = 1,
        //        Size = 1,
        //        SqlDbType = System.Data.SqlDbType.Bit,
        //        Value = IsAsc,
        //    };

        //    var result = await _context.SqlQuery<ReportByClientResult>("EXEC [dbo].[ReportByClient] @Key,@FromDate,@ToDate,@offset,@Limit,@SortField,@IsAsc  ", parameterKey, parameterFromDate, parameterToDate, parameteroffset, parameterLimit, parameterSortField, parameterIsAsc);

        //    return result;
        //}

        //public async Task<ReportByCTVResult[]> ReportByCTV(string Key, int? IdGroup, DateTime? FromDate, DateTime? ToDate, int? Offset, int? Limit, string SortField, bool? IsAsc)
        //{
        //    var parameterKey = new SqlParameter
        //    {
        //        ParameterName = "Key",
        //        Precision = 200,
        //        Size = 400,
        //        SqlDbType = System.Data.SqlDbType.NVarChar,
        //        Value = Key,
        //    };

        //    var parameterIdGroup = new SqlParameter
        //    {
        //        ParameterName = "IdGroup",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = IdGroup,
        //    };

        //    var parameterFromDate = new SqlParameter
        //    {
        //        ParameterName = "FromDate",
        //        Precision = 10,
        //        Size = 3,
        //        SqlDbType = System.Data.SqlDbType.Date,
        //        Value = FromDate,
        //    };

        //    var parameterToDate = new SqlParameter
        //    {
        //        ParameterName = "ToDate",
        //        Precision = 10,
        //        Size = 3,
        //        SqlDbType = System.Data.SqlDbType.Date,
        //        Value = ToDate,
        //    };

        //    var parameterOffset = new SqlParameter
        //    {
        //        ParameterName = "Offset",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = Offset,
        //    };

        //    var parameterLimit = new SqlParameter
        //    {
        //        ParameterName = "Limit",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = Limit,
        //    };

        //    var parameterSortField = new SqlParameter
        //    {
        //        ParameterName = "SortField",
        //        Precision = 100,
        //        Size = 100,
        //        SqlDbType = System.Data.SqlDbType.VarChar,
        //        Value = SortField,
        //    };

        //    var parameterIsAsc = new SqlParameter
        //    {
        //        ParameterName = "IsAsc",
        //        Precision = 1,
        //        Size = 1,
        //        SqlDbType = System.Data.SqlDbType.Bit,
        //        Value = IsAsc,
        //    };

        //    var result = await _context.SqlQuery<ReportByCTVResult>("EXEC [dbo].[ReportByCTV] @Key,@IdGroup,@FromDate,@ToDate,@Offset,@Limit,@SortField,@IsAsc  ", parameterKey, parameterIdGroup, parameterFromDate, parameterToDate, parameterOffset, parameterLimit, parameterSortField, parameterIsAsc);

        //    return result;
        //}

        //public async Task<ReportByCTV_TotalResult[]> ReportByCTV_Total(string Key, int? IdGroup, DateTime? FromDate, DateTime? ToDate)
        //{
        //    var parameterKey = new SqlParameter
        //    {
        //        ParameterName = "Key",
        //        Precision = 200,
        //        Size = 400,
        //        SqlDbType = System.Data.SqlDbType.NVarChar,
        //        Value = Key,
        //    };

        //    var parameterIdGroup = new SqlParameter
        //    {
        //        ParameterName = "IdGroup",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = IdGroup,
        //    };

        //    var parameterFromDate = new SqlParameter
        //    {
        //        ParameterName = "FromDate",
        //        Precision = 10,
        //        Size = 3,
        //        SqlDbType = System.Data.SqlDbType.Date,
        //        Value = FromDate,
        //    };

        //    var parameterToDate = new SqlParameter
        //    {
        //        ParameterName = "ToDate",
        //        Precision = 10,
        //        Size = 3,
        //        SqlDbType = System.Data.SqlDbType.Date,
        //        Value = ToDate,
        //    };

        //    var result = await _context.SqlQuery<ReportByCTV_TotalResult>("EXEC [dbo].[ReportByCTV_Total] @Key,@IdGroup,@FromDate,@ToDate  ", parameterKey, parameterIdGroup, parameterFromDate, parameterToDate);

        //    return result;
        //}

        //public async Task<int> sp_upgraddiagrams()
        //{
        //    return await _context.Database.ExecuteSqlRawAsync("EXEC [dbo].[sp_upgraddiagrams]");
        //}

        //public async Task<int> Statement_Order(int? IdCTV, int? IdDN, int? IdDapFood, int? IdOrder, bool? New)
        //{
        //    var parameterIdCTV = new SqlParameter
        //    {
        //        ParameterName = "IdCTV",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = IdCTV,
        //    };

        //    var parameterIdDN = new SqlParameter
        //    {
        //        ParameterName = "IdDN",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = IdDN,
        //    };

        //    var parameterIdDapFood = new SqlParameter
        //    {
        //        ParameterName = "IdDapFood",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = IdDapFood,
        //    };

        //    var parameterIdOrder = new SqlParameter
        //    {
        //        ParameterName = "IdOrder",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = IdOrder,
        //    };

        //    var parameterNew = new SqlParameter
        //    {
        //        ParameterName = "New",
        //        Precision = 1,
        //        Size = 1,
        //        SqlDbType = System.Data.SqlDbType.Bit,
        //        Value = New,
        //    };

        //    return await _context.Database.ExecuteSqlRawAsync("EXEC [dbo].[Statement_Order] @IdCTV,@IdDN,@IdDapFood,@IdOrder,@New  ", parameterIdCTV, parameterIdDN, parameterIdDapFood, parameterIdOrder, parameterNew);
        //}

        //public async Task<int> Statement_RegisterReward(int? UserId, int? RefId, int? IdDapFood, int? Reward, OutputParameter<int?> retVal)
        //{
        //    var parameterUserId = new SqlParameter
        //    {
        //        ParameterName = "UserId",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = UserId,
        //    };

        //    var parameterRefId = new SqlParameter
        //    {
        //        ParameterName = "RefId",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = RefId,
        //    };

        //    var parameterIdDapFood = new SqlParameter
        //    {
        //        ParameterName = "IdDapFood",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = IdDapFood,
        //    };

        //    var parameterReward = new SqlParameter
        //    {
        //        ParameterName = "Reward",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = Reward,
        //    };

        //    var parameterretVal = new SqlParameter
        //    {
        //        ParameterName = "retVal",
        //        Precision = 10,
        //        Size = 4,
        //        Direction = System.Data.ParameterDirection.Output,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = retVal,
        //    };

        //    return await _context.Database.ExecuteSqlRawAsync("EXEC [dbo].[Statement_RegisterReward] @UserId,@RefId,@IdDapFood,@Reward, @retVal OUTPUT ", parameterUserId, parameterRefId, parameterIdDapFood, parameterReward, parameterretVal);
        //    retVal.SetValueInternal(parameterretVal.Value);
        //}

        //public async Task<int> UpdateCollate()
        //{
        //    return await _context.Database.ExecuteSqlRawAsync("EXEC [dbo].[UpdateCollate]");
        //}

        //public async Task<int> User_UpdateBalance(int? UserId, int? Deal, OutputParameter<int?> retVal)
        //{
        //    var parameterUserId = new SqlParameter
        //    {
        //        ParameterName = "UserId",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = UserId,
        //    };

        //    var parameterDeal = new SqlParameter
        //    {
        //        ParameterName = "Deal",
        //        Precision = 10,
        //        Size = 4,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = Deal,
        //    };

        //    var parameterretVal = new SqlParameter
        //    {
        //        ParameterName = "retVal",
        //        Precision = 10,
        //        Size = 4,
        //        Direction = System.Data.ParameterDirection.Output,
        //        SqlDbType = System.Data.SqlDbType.Int,
        //        Value = retVal,
        //    };

        //    return await _context.Database.ExecuteSqlRawAsync("EXEC [dbo].[User_UpdateBalance] @UserId,@Deal, @retVal OUTPUT ", parameterUserId, parameterDeal, parameterretVal);
        //    retVal.SetValueInternal(parameterretVal.Value);
        //}

    }
}
