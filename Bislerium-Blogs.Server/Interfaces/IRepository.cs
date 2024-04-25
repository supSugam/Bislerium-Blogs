namespace Bislerium_Blogs.Server.Interfaces
{
    public interface IRepository<TEntity> where TEntity: class
    {
        Task<IEnumerable<TEntity>> GetAll();
        Task<TEntity> GetById(string id);
        Task Create(TEntity entity);
        Task Update(TEntity entity);
        Task Delete(string id);
    }
}
