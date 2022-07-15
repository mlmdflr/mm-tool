/**
 * @description 雪花算法类,用于生成随机id
 * @author 没礼貌的芬兰人
 * @date 2021-10-06 17:13:16
 */
class Snowflake {
  private static twepoch = BigInt(1548988646430);

  private static workerIdBits: bigint = BigInt(5);
  private static dataCenterIdBits: bigint = BigInt(5);
  private static sequenceBits: bigint = BigInt(12);

  private static maxWorkerId: bigint =
    BigInt(-1) ^ (BigInt(-1) << BigInt(Snowflake.workerIdBits));
  private static maxDataCenterId: bigint =
    BigInt(-1) ^ (BigInt(-1) << BigInt(Snowflake.dataCenterIdBits));
  private static sequenceMask: bigint =
    BigInt(-1) ^ (BigInt(-1) << Snowflake.sequenceBits);

  private static workerIdShift: bigint = Snowflake.sequenceBits;
  private static dataCenterIdShift: bigint =
    Snowflake.sequenceBits + Snowflake.workerIdBits;
  private static timestampLeftShift: bigint =
    Snowflake.dataCenterIdShift + Snowflake.dataCenterIdBits;

  private static sequence: bigint = BigInt(0);
  private static lastTimestamp: bigint = BigInt(-1);
  private static workerId: bigint;
  private static dataCenterId: bigint;

  constructor(workerId: bigint, dataCenterId: bigint) {
    if (workerId > Snowflake.maxWorkerId || workerId < BigInt(0))
      throw new Error(
        `workerId can't be greater than ${Snowflake.maxWorkerId} or less than 0`
      );
    if (dataCenterId > Snowflake.maxDataCenterId || dataCenterId < BigInt(0))
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
    if (diff < BigInt(0))
      throw new Error(
        `Clock moved backwards. Refusing to generate id for ${-diff} milliseconds`
      );
    if (diff === BigInt(0)) {
      Snowflake.sequence =
        (Snowflake.sequence + BigInt(1)) & Snowflake.sequenceMask;
      if (Snowflake.sequence === BigInt(0)) {
        timestamp = Snowflake.tilNextMillis(Snowflake.lastTimestamp);
      }
    } else Snowflake.sequence = BigInt(0);
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

export { Snowflake };
