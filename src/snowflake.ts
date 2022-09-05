/**
 * @description 雪花算法类,用于生成随机id
 * @author 没礼貌的芬兰人
 * @date 2021-10-06 17:13:16
 */
export class Snowflake {
  private static twepoch = 1658110470937n;

  private static workerIdBits: bigint = 5n;
  private static dataCenterIdBits: bigint = 5n;
  private static sequenceBits: bigint = 12n;

  private static maxWorkerId: bigint = -1n ^ (-1n << Snowflake.workerIdBits);
  private static maxDataCenterId: bigint =
    -1n ^ (-1n << Snowflake.dataCenterIdBits);
  private static sequenceMask: bigint = -1n ^ (-1n << Snowflake.sequenceBits);

  private static workerIdShift: bigint = Snowflake.sequenceBits;
  private static dataCenterIdShift: bigint =
    Snowflake.sequenceBits + Snowflake.workerIdBits;
  private static timestampLeftShift: bigint =
    Snowflake.dataCenterIdShift + Snowflake.dataCenterIdBits;

  private static sequence: bigint = 0n;
  private static lastTimestamp: bigint = -1n;
  private static workerId: bigint;
  private static dataCenterId: bigint;

  constructor(workerId: bigint, dataCenterId: bigint) {
    if (workerId > Snowflake.maxWorkerId || workerId < 0n)
      throw new Error(
        `workerId can't be greater than ${Snowflake.maxWorkerId} or less than 0`
      );
    if (dataCenterId > Snowflake.maxDataCenterId || dataCenterId < 0n)
      throw new Error(
        `dataCenterId can't be greater than ${Snowflake.maxDataCenterId} or less than 0`
      );
    Snowflake.workerId = workerId;
    Snowflake.dataCenterId = dataCenterId;
    return this;
  }
  public nextId(): bigint {
    let timestamp = Snowflake.currentLinuxTime();
    const diff = timestamp - Snowflake.lastTimestamp;
    if (diff < 0n)
      throw new Error(
        `Clock moved backwards. Refusing to generate id for ${-diff} milliseconds`
      );
    if (diff === 0n) {
      Snowflake.sequence = (Snowflake.sequence + 1n) & Snowflake.sequenceMask;
      if (Snowflake.sequence === 0n) {
        timestamp = Snowflake.tilNextMillis(Snowflake.lastTimestamp);
      }
    } else Snowflake.sequence = 0n;
    Snowflake.lastTimestamp = timestamp;
    return (
      ((timestamp - Snowflake.twepoch) << Snowflake.timestampLeftShift) |
      (Snowflake.dataCenterId << Snowflake.dataCenterIdShift) |
      (Snowflake.workerId << Snowflake.workerIdShift) |
      Snowflake.sequence
    );
  }
  public static tilNextMillis(lastTimeStamp: bigint) {
    let timestamp: bigint = Snowflake.currentLinuxTime();
    while (timestamp <= lastTimeStamp) timestamp = Snowflake.currentLinuxTime();
    return timestamp;
  }
  private static currentLinuxTime(): bigint {
    return BigInt(new Date().valueOf());
  }
}
